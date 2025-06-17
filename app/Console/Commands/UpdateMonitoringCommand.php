<?php

namespace App\Console\Commands;

use App\Models\Server;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use xPaw\SourceQuery\SourceQuery;

class UpdateMonitoringCommand extends Command
{
    protected $signature = 'monitoring:update {--force : Force update all servers regardless of cache time}';
    protected $description = 'Update server monitoring cache data';

    private const CACHE_DURATION = 1;

    public function handle()
    {
        $cachePath = storage_path('/app/server_data.json');
        $currentTime = time();
        $forceUpdate = $this->option('force');

        $existingCache = [];
        if (file_exists($cachePath)) {
            $existingCache = json_decode(file_get_contents($cachePath), true) ?: [];
        }

        $existingCacheById = [];
        foreach ($existingCache as $item) {
            if (isset($item['id'])) {
                $existingCacheById[$item['id']] = $item;
            }
        }

        $servers = Server::where('visible', true)->get();
        $totalCount = $servers->count();

        $this->info("Found {$totalCount} visible servers to check");
        $progressBar = $this->output->createProgressBar($totalCount);
        $progressBar->start();

        $newData = [];
        $updatedCount = 0;

        try {
            foreach ($servers as $server) {
                $needsUpdate = $forceUpdate;

                if (!$forceUpdate && isset($existingCacheById[$server->id]['last_updated'])) {
                    $lastUpdated = $existingCacheById[$server->id]['last_updated'];
                    if ($currentTime - $lastUpdated < 30) {
                        $newData[$server->id] = $existingCacheById[$server->id];
                        $needsUpdate = false;
                    }
                }

                if ($needsUpdate) {
                    $newData[$server->id] = $this->updateServerData($server, $currentTime);
                    $updatedCount++;
                }

                $progressBar->advance();
            }

            $progressBar->finish();
            $this->newLine();


            if (count($newData) === $totalCount) {
                file_put_contents($cachePath, json_encode(array_values($newData), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                $this->info("Monitoring update completed!");
                $this->info("Updated: {$updatedCount} servers");
                $this->info("Cached: " . ($totalCount - $updatedCount) . " servers");
                $this->info("Total: {$totalCount} servers");
            } else {
                $this->error("Failed to update all servers, JSON cache was NOT updated.");
            }

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $progressBar->finish();
            $this->newLine();

            Log::error("Critical error during monitoring update: " . $e->getMessage());
            $this->error("Critical error: " . $e->getMessage());

            return Command::FAILURE;
        }
    }


    private function updateServerData(Server $server, int $currentTime): array
    {
        $query = new SourceQuery();

        try {
            $query->Connect($server->ip, $server->query_port, 3, SourceQuery::SOURCE);
            $info = $query->GetInfo();
            $gameTags = $info['GameTags'] ?? '';

            // Извлекаем данные из GameTags
            preg_match('/cp(\d+)/', $gameTags, $cp);
            preg_match('/qp(\d+)/', $gameTags, $qp);
            preg_match('/mp(\d+)/', $gameTags, $mp); // Извлекаем слоты из mp тега

            $players = isset($cp[1]) ? (int)$cp[1] : ($info['Players'] ?? 0);
            $queue = isset($qp[1]) ? (int)$qp[1] : 0;
            $slots = isset($mp[1]) ? (int)$mp[1] : ($info['MaxPlayers'] ?? 0); // Используем mp тег для слотов
            $joining = 0; // jp тег не найден в примере, оставляем 0

            return [
                'id' => $server->id,
                'host' => $server->ip,
                'ip' => $server->ip,
                'port' => $server->game_port,
                'otladka' => $gameTags,
                'name' => $server->name,
                'image' => $server->image,
                'about' => $server->about,
                'query_port' => $server->query_port,
                'online' => $players,
                'joining' => $joining,
                'queue' => $queue,
                'slots' => $slots,
                'zid' => $server->zid,
                'percentagePlayers' => $slots ? round($players / $slots * 100) : 0,
                'percentageJoining' => $slots ? round($joining / $slots * 100) : 0,
                'percentageQueue' => $slots ? round($queue / $slots * 100) : 0,
                'status' => $slots ? 'Доступен' : 'Недоступен',
                'last_updated' => $currentTime,
                'last_updated_readable' => date('Y-m-d H:i:s', $currentTime),
            ];
        } catch (\Exception $e) {
            Log::error("Ошибка запроса к серверу {$server->ip}: " . $e->getMessage());
            $this->error("✗ Failed to update server: {$server->name} ({$server->ip}) - {$e->getMessage()}");

            return [
                'id' => $server->id,
                'host' => $server->ip,
                'name' => $server->name,
                'image' => $server->image,
                'about' => $server->about,
                'query_port' => $server->query_port,
                'online' => 0,
                'joining' => 0,
                'queue' => 0,
                'slots' => 0,
                'percentagePlayers' => 0,
                'percentageJoining' => 0,
                'percentageQueue' => 0,
                'status' => 'Недоступен',
                'last_updated' => $currentTime,
                'last_updated_readable' => date('Y-m-d H:i:s', $currentTime),
            ];
        } finally {
            $query->Disconnect();
        }
    }
}
