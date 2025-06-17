<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentStatistic;
use App\Models\Server;
use App\Models\ShopItem;
use App\Models\BuyLogNew;
use App\Models\User;
use App\Models\BuyLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\OtherLogs;

use App\Models\PromoLogs;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PaymentStatisticController extends Controller
{

    public function getAllLogs(Request $request)
    {
        $validated = $request->validate([
            'steamid' => 'nullable|string',
            'type' => 'nullable|in:buy_log,buy_log_new,payment_statistic,other_log,promo_log',
            'sort_by' => 'nullable|string',
            'sort_direction' => 'nullable|in:asc,desc'
        ]);

        $buyLogs = BuyLog::select(
            DB::raw("'buy_log' as log_type"),
            'buy_logs.id',
            'buy_logs.steamid',
            'buy_logs.item_name',
            'buy_logs.price',
            'buy_logs.created_at',
            'users.name',
            DB::raw("NULL as message")
        )->leftJoin('users', 'buy_logs.steamid', '=', 'users.steamid');

        $buyLogsNew = BuyLogNew::select(
            DB::raw("'buy_log_new' as log_type"),
            'buy_log_news.id',
            'buy_log_news.steamid',
            'buy_log_news.item_name',
            'buy_log_news.price',
            'buy_log_news.created_at',
            'users.name',
            DB::raw("NULL as message")
        )->leftJoin('users', 'buy_log_news.steamid', '=', 'users.steamid');

        $paymentStats = PaymentStatistic::select(
            DB::raw("'payment_statistic' as log_type"),
            'payment_statistics.id',
            'payment_statistics.steamid',
            DB::raw("'Пополнение счета' as item_name"),
            'payment_statistics.amount as price',
            'payment_statistics.created_at',
            'users.name',
            DB::raw("NULL as message")
        )->leftJoin('users', 'payment_statistics.steamid', '=', 'users.steamid');

        $otherLogs = OtherLogs::select(
            DB::raw("'other_log' as log_type"),
            'other_logs.id',
            'other_logs.steamid',
            'other_logs.name as item_name',
            'other_logs.sum as price',
            'other_logs.created_at',
            'users.name',
            DB::raw("CASE WHEN other_logs.message IS NULL THEN 'без описания' ELSE other_logs.message END as message")
        )->leftJoin('users', 'other_logs.steamid', '=', 'users.steamid');

        $promoLogs = PromoLogs::select(
            DB::raw("'promo_log' as log_type"),
            'promo_logs.id',
            'promo_logs.steamid',
            'promo_logs.name as item_name',
            'promo_logs.sum as price',
            'promo_logs.created_at',
            'users.name',
            DB::raw("NULL as message")
        )->leftJoin('users', 'promo_logs.steamid', '=', 'users.steamid');

        if (!empty($validated['steamid'])) {
            $searchTerm = $validated['steamid'];

            $buyLogs->where(function($query) use ($searchTerm) {
                $query->where('buy_logs.steamid', 'like', "%{$searchTerm}%")
                    ->orWhere('users.name', 'like', "%{$searchTerm}%");
            });

            $buyLogsNew->where(function($query) use ($searchTerm) {
                $query->where('buy_log_news.steamid', 'like', "%{$searchTerm}%")
                    ->orWhere('users.name', 'like', "%{$searchTerm}%");
            });

            $paymentStats->where(function($query) use ($searchTerm) {
                $query->where('payment_statistics.steamid', 'like', "%{$searchTerm}%")
                    ->orWhere('users.name', 'like', "%{$searchTerm}%");
            });

            $otherLogs->where(function($query) use ($searchTerm) {
                $query->where('other_logs.steamid', 'like', "%{$searchTerm}%")
                    ->orWhere('users.name', 'like', "%{$searchTerm}%");
            });

            $promoLogs->where(function($query) use ($searchTerm) {
                $query->where('promo_logs.steamid', 'like', "%{$searchTerm}%")
                    ->orWhere('users.name', 'like', "%{$searchTerm}%");
            });
        }

        $combinedLogs = $buyLogs
            ->union($buyLogsNew)
            ->union($paymentStats)
            ->union($otherLogs)
            ->union($promoLogs);

        if (!empty($validated['type'])) {
            switch ($validated['type']) {
                case 'buy_log':
                    $combinedLogs = BuyLog::select(
                        DB::raw("'buy_log' as log_type"),
                        'buy_logs.id',
                        'buy_logs.steamid',
                        'buy_logs.item_name',
                        'buy_logs.price',
                        'buy_logs.created_at',
                        'users.name',
                        DB::raw("NULL as message")
                    )->leftJoin('users', 'buy_logs.steamid', '=', 'users.steamid');

                    if (!empty($validated['steamid'])) {
                        $searchTerm = $validated['steamid'];
                        $combinedLogs->where(function($query) use ($searchTerm) {
                            $query->where('buy_logs.steamid', 'like', "%{$searchTerm}%")
                                ->orWhere('users.name', 'like', "%{$searchTerm}%");
                        });
                    }
                    break;
                case 'buy_log_new':
                    $combinedLogs = BuyLogNew::select(
                        DB::raw("'buy_log_new' as log_type"),
                        'buy_log_news.id',
                        'buy_log_news.steamid',
                        'buy_log_news.item_name',
                        'buy_log_news.price',
                        'buy_log_news.created_at',
                        'users.name',
                        DB::raw("NULL as message")
                    )->leftJoin('users', 'buy_log_news.steamid', '=', 'users.steamid');

                    if (!empty($validated['steamid'])) {
                        $searchTerm = $validated['steamid'];
                        $combinedLogs->where(function($query) use ($searchTerm) {
                            $query->where('buy_log_news.steamid', 'like', "%{$searchTerm}%")
                                ->orWhere('users.name', 'like', "%{$searchTerm}%");
                        });
                    }
                    break;
                case 'payment_statistic':
                    $combinedLogs = PaymentStatistic::select(
                        DB::raw("'payment_statistic' as log_type"),
                        'payment_statistics.id',
                        'payment_statistics.steamid',
                        DB::raw("'Пополнение счета' as item_name"),
                        'payment_statistics.amount as price',
                        'payment_statistics.created_at',
                        'users.name',
                        DB::raw("NULL as message")
                    )->leftJoin('users', 'payment_statistics.steamid', '=', 'users.steamid');

                    if (!empty($validated['steamid'])) {
                        $searchTerm = $validated['steamid'];
                        $combinedLogs->where(function($query) use ($searchTerm) {
                            $query->where('payment_statistics.steamid', 'like', "%{$searchTerm}%")
                                ->orWhere('users.name', 'like', "%{$searchTerm}%");
                        });
                    }
                    break;
                case 'other_log':
                    $combinedLogs = OtherLogs::select(
                        DB::raw("'other_log' as log_type"),
                        'other_logs.id',
                        'other_logs.steamid',
                        'other_logs.name as item_name',
                        'other_logs.sum as price',
                        'other_logs.created_at',
                        'users.name',
                        DB::raw("CASE WHEN other_logs.message IS NULL THEN 'без описания' ELSE other_logs.message END as message")
                    )->leftJoin('users', 'other_logs.steamid', '=', 'users.steamid');

                    if (!empty($validated['steamid'])) {
                        $searchTerm = $validated['steamid'];
                        $combinedLogs->where(function($query) use ($searchTerm) {
                            $query->where('other_logs.steamid', 'like', "%{$searchTerm}%")
                                ->orWhere('users.name', 'like', "%{$searchTerm}%");
                        });
                    }
                    break;
                case 'promo_log':
                    $combinedLogs = PromoLogs::select(
                        DB::raw("'promo_log' as log_type"),
                        'promo_logs.id',
                        'promo_logs.steamid',
                        'promo_logs.name as item_name',
                        'promo_logs.sum as price',
                        'promo_logs.created_at',
                        'users.name',
                        DB::raw("NULL as message")
                    )->leftJoin('users', 'promo_logs.steamid', '=', 'users.steamid');

                    if (!empty($validated['steamid'])) {
                        $searchTerm = $validated['steamid'];
                        $combinedLogs->where(function($query) use ($searchTerm) {
                            $query->where('promo_logs.steamid', 'like', "%{$searchTerm}%")
                                ->orWhere('users.name', 'like', "%{$searchTerm}%");
                        });
                    }
                    break;
            }
        }

        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';

        $sortByWithPrefix = match($sortBy) {
            'id' => 'temp_table.id',
            'steamid' => 'temp_table.steamid',
            'item_name' => 'temp_table.item_name',
            'price' => 'temp_table.price',
            'created_at' => 'temp_table.created_at',
            'name' => 'temp_table.name',
            default => 'temp_table.created_at'
        };

        $results = DB::table(DB::raw("({$combinedLogs->toSql()}) as temp_table"))
            ->mergeBindings($combinedLogs->getQuery())
            ->orderBy($sortByWithPrefix, $sortDirection)
            ->paginate(20);

        return Inertia::render('dashboard/logs', [
            'logs' => $results,
            'logStatistics' => $this->getLogsStatistics(),
            'filters' => $request->all()
        ]);
    }
    /**
     * Получение статистики по логам
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function getLogsStatistics()
    {
        return [
            'buy_log' => [
                'total_count' => BuyLog::count(),
                'total_amount' => BuyLog::sum('price')
            ],
            'buy_log_new' => [
                'total_count' => BuyLogNew::count(),
                'total_amount' => BuyLogNew::sum('price')
            ],
            'payment_statistic' => [
                'total_count' => PaymentStatistic::count(),
                'total_amount' => PaymentStatistic::sum('amount')
            ]
        ];
    }


    public function index(Request $request)
    {
        $period = $request->input('period', '30d');
        $groupBy = $request->input('group_by', 'day');
        $startDate = $this->getStartDate($period);
        $topServer = BuyLog::select(
            'servers.name as server_name',
            DB::raw('SUM(price) as total_revenue')
        )
            ->join('servers', 'buy_logs.server_id', '=', 'servers.id')
            ->where('buy_logs.created_at', '>=', $startDate)
            ->groupBy('buy_logs.server_id', 'servers.name')
            ->orderByDesc('total_revenue')
            ->limit(1)
            ->first();

        return response()->json([
            'purchases' => $this->getPurchasesStatistics($startDate, $groupBy),
            'payments' => $this->getPaymentsStatistics($startDate, $groupBy),
            'top_items' => $this->getTopItems($startDate),
            'top_donators' => PaymentStatistic::select(
                DB::raw('(SELECT name FROM users WHERE users.steamid = payment_statistics.steamid) as steamid'),
                DB::raw('SUM(amount) as total')
            )
                ->where('created_at', '>=', $startDate)
                ->groupBy('steamid')
                ->orderByDesc('total')
                ->limit(10)
                ->get(),
            'top_server' => $topServer,

            'top_servers' => $this->getTopServers($startDate),
            'payment_methods' => $this->getPaymentMethodsStats($startDate),
            'summary' => $this->getSummaryStats($startDate),
            'period' => $period,
        ]);
    }


    /**
     * Получение статистики покупок
     */
    private function getPurchasesStatistics(Carbon $startDate, string $groupBy)
    {
        $dateFormat = $this->getDateFormat($groupBy);

        return BuyLog::where('created_at', '>=', $startDate)
            ->select(
                DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as date"),
                DB::raw('SUM(price) as total_amount'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    /**
     * Получение статистики платежей
     */
    private function getPaymentsStatistics(Carbon $startDate, string $groupBy)
    {
        $dateFormat = $this->getDateFormat($groupBy);

        // Получаем все платежи
        $allPayments = PaymentStatistic::where('created_at', '>=', $startDate)
            ->select(
                DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as date"),
                DB::raw('SUM(amount) as total_amount'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        // Получаем платежи по методам
        $paymentsByMethodRaw = PaymentStatistic::where('created_at', '>=', $startDate)
            ->select(
                DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as date"),
                'method',
                DB::raw('SUM(amount) as total_amount'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date', 'method')
            ->orderBy('date')
            ->get();

        // Определяем диапазон дат - включая текущий день полностью
        $endDate = Carbon::now('Europe/Moscow')->endOfDay();
        $dateRange = [];
        $currentDate = $startDate->copy();

        while ($currentDate <= $endDate) {
            $formattedDate = $currentDate->format($this->getDateFormat($groupBy) === '%Y-%m-%d' ? 'Y-m-d' : 'Y-m');
            $dateRange[$formattedDate] = [
                'date' => $formattedDate,
                'total_amount' => '0.00',
                'count' => 0
            ];

            // Инкрементируем в зависимости от группировки
            if ($groupBy === 'month') {
                $currentDate->addMonth();
            } else if ($groupBy === 'week') {
                $currentDate->addWeek();
            } else {
                $currentDate->addDay();
            }
        }

        // Заполняем all_payments
        $allPaymentsData = $dateRange;
        foreach ($allPayments as $date => $payment) {
            $allPaymentsData[$date] = [
                'date' => $date,
                'total_amount' => number_format($payment->total_amount, 2, '.', ''),
                'count' => $payment->count
            ];
        }

        // Обрабатываем платежи по методам
        $methodsData = [];
        $uniqueMethods = $paymentsByMethodRaw->pluck('method')->unique()->values();

        foreach ($uniqueMethods as $method) {
            foreach ($dateRange as $date => $default) {
                $payment = $paymentsByMethodRaw->firstWhere(function ($item) use ($date, $method) {
                    return $item->date === $date && $item->method === $method;
                });

                $methodsData[] = [
                    'date' => $date,
                    'method' => $method,
                    'total_amount' => $payment ? number_format($payment->total_amount, 2, '.', '') : '0.00',
                    'count' => $payment ? $payment->count : 0
                ];
            }
        }

        return [
            'all_payments' => collect(array_values($allPaymentsData)),
            'payment_methods' => collect($methodsData)
        ];
    }
    /**
     * Получение топ покупаемых предметов
     */
    private function getTopItems(Carbon $startDate)
    {
        return BuyLog::where('buy_logs.created_at', '>=', $startDate)
            ->select(
                'item_id',
                'item_name',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(price) as total_amount')
            )
            ->groupBy('item_id', 'item_name')
            ->orderByDesc('count')
            ->limit(10)
            ->get();
    }

    /**
     * Получение топ серверов по покупкам
     */
    private function getTopServers(Carbon $startDate)
    {
        return BuyLog::where('buy_logs.created_at', '>=', $startDate)
            ->leftJoin('servers', 'buy_logs.server_id', '=', 'servers.id')
            ->select(
                'buy_logs.server_id',
                'servers.name as server_name',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(buy_logs.price) as total_amount')
            )
            ->groupBy('buy_logs.server_id', 'servers.name')
            ->orderByDesc('total_amount')
            ->limit(10)
            ->get();
    }

    /**
     * Получение статистики по методам оплаты
     */
    private function getPaymentMethodsStats(Carbon $startDate)
    {
        return PaymentStatistic::where('created_at', '>=', $startDate)
            ->select(
                'method',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(amount) as total_amount')
            )
            ->groupBy('method')
            ->orderByDesc('total_amount')
            ->get();
    }

    /**
     * Получение общей статистики
     */
    private function getSummaryStats(Carbon $startDate)
    {
        $totalPurchases = BuyLog::where('created_at', '>=', $startDate)->count();
        $totalPurchasesAmount = BuyLog::where('created_at', '>=', $startDate)->sum('price');

        $totalPayments = PaymentStatistic::where('created_at', '>=', $startDate)->count();
        $totalPaymentsAmount = PaymentStatistic::where('created_at', '>=', $startDate)->sum('amount');

        $uniqueUsers = User::where('created_at', '>=', $startDate)->count();


        $averagePurchaseAmount = $totalPurchases > 0
            ? $totalPurchasesAmount / $totalPurchases
            : 0;

        return [
            'total_purchases' => $totalPurchases,
            'total_purchases_amount' => $totalPurchasesAmount,
            'total_payments' => $totalPayments,
            'total_payments_amount' => $totalPaymentsAmount,
            'unique_users' => $uniqueUsers,
            'average_purchase_amount' => $averagePurchaseAmount,
        ];
    }

    /**
     * Получение начальной даты для фильтрации по периоду
     */
    private function getStartDate($period)
    {
        // Используем текущую дату до конца дня
        $now = Carbon::now('Europe/Moscow')->endOfDay();
        $minDate = Carbon::create(2025, 4, 8)->startOfDay();

        switch ($period) {
            case '1d':
                $date = $now->copy()->startOfDay();
                break;
            case '7d':
                $date = $now->copy()->startOfDay()->subDays(7);
                break;
            case '14d':
                $date = $now->copy()->startOfDay()->subDays(14);
                break;
            case '30d':
                $date = $now->copy()->startOfDay()->subDays(30);
                break;
            case 'year':
                $date = $now->copy()->startOfDay()->subYear();
                break;
            case 'all':
                $date = $now->copy()->startOfDay()->subYears(5);
                break;
            default:
                $date = $now->copy()->startOfDay()->subDays(30);
                break;
        }

        return $date->lessThan($minDate) ? $minDate : $date;
    }

    /**
     * Получение формата даты для группировки
     */
    private function getDateFormat(string $groupBy)
    {
        switch ($groupBy) {
            case 'day':
                return '%Y-%m-%d';
            case 'week':
                return '%Y-%u';
            case 'month':
                return '%Y-%m';
            case 'year':
                return '%Y';
            default:
                return '%Y-%m-%d';
        }
    }

    /**
     * Детальная статистика по конкретному серверу
     */
    public function serverStatistics(Request $request, $serverId)
    {
        $period = $request->input('period', '30d');
        $groupBy = $request->input('group_by', 'day');
        $startDate = $this->getStartDate($period);

        $server = Server::findOrFail($serverId);

        $purchases = BuyLog::where('server_id', $serverId)
            ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw("DATE_FORMAT(created_at, '{$this->getDateFormat($groupBy)}') as date"),
                DB::raw('SUM(price) as total_amount'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topItems = BuyLog::where('server_id', $serverId)
            ->where('created_at', '>=', $startDate)
            ->select(
                'item_id',
                'item_name',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(price) as total_amount')
            )
            ->groupBy('item_id', 'item_name')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return response()->json([
            'server' => $server,
            'purchases' => $purchases,
            'top_items' => $topItems,
            'period' => $period,
        ]);
    }

    /**
     * Детальная статистика по конкретному предмету
     */
    public function itemStatistics(Request $request, $itemId)
    {
        $period = $request->input('period', '30d');
        $groupBy = $request->input('group_by', 'day');
        $startDate = $this->getStartDate($period);

        $item = ShopItem::findOrFail($itemId);

        $purchases = BuyLog::where('item_id', $itemId)
            ->where('buy_logs.created_at', '>=', $startDate)
            ->select(
                DB::raw("DATE_FORMAT(buy_logs.created_at, '{$this->getDateFormat($groupBy)}') as date"),
                DB::raw('SUM(price) as total_amount'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topServers = BuyLog::where('item_id', $itemId)
            ->where('buy_logs.created_at', '>=', $startDate)
            ->leftJoin('servers', 'buy_logs.server_id', '=', 'servers.id')
            ->select(
                'buy_logs.server_id',
                'servers.name as server_name',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(buy_logs.price) as total_amount')
            )
            ->groupBy('buy_logs.server_id', 'servers.name')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return response()->json([
            'item' => $item,
            'purchases' => $purchases,
            'top_servers' => $topServers,
            'period' => $period,
        ]);
    }

    public function getTopItemsByServer(Request $request)
    {
        // Количество предметов в топе
        $limit = $request->input('limit', 100000);
        $period = $request->input('period', '30d');
        $startDate = $this->getStartDate($period);

        $topItems = BuyLogNew::select(
            'stats_name as server',
            'item_name as item',
            DB::raw('COUNT(*) as purchase_count'),
            DB::raw('SUM(price) as total_revenue')
        )
            ->where('created_at', '>=', $startDate)  // Добавляем фильтр по дате
            ->groupBy('stats_name', 'item_name')
            ->orderByRaw('stats_name ASC, COUNT(*) DESC')
            ->get()
            ->groupBy('server')
            ->map(function ($items) use ($limit) {
                // Возвращаем только top N предметов для каждого сервера
                return $items->take($limit);
            });

        return response()->json([
            'success' => true,
            'data' => $topItems
        ]);
    }


    /**
     * Получение статистики прибыльности серверов
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getServerRevenue(Request $request)
    {
        $period = $request->input('period', '30d');
        $startDate = $this->getStartDate($period);

        $serverRevenue = BuyLogNew::select(
            'stats_name as server',
            DB::raw('COUNT(*) as total_purchases'),
            DB::raw('SUM(price) as total_revenue'),
            DB::raw('AVG(price) as average_price')
        )
            ->where('created_at', '>=', $startDate)  // Добавляем фильтр по дате
            ->groupBy('stats_name')
            ->orderBy('total_revenue', 'DESC')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $serverRevenue
        ]);
    }

}
