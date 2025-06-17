<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;

use App\Models\Server;
use Illuminate\Http\Request;

class ServerController extends Controller
{
    // Метод для отображения списка серверов с пагинацией и фильтрацией
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $servers = Server::where('name', 'like', "%{$search}%")
            ->orWhere('ip', 'like', "%{$search}%")
            ->paginate(10);

        return inertia('dashboard/servers', [
            'servers' => $servers,
            'filters' => $request->only('search'),
        ]);
    }

    // Метод для создания нового сервера
    public function create()
    {
        return inertia('Dashboard/Servers/Create');
    }

    // Метод для сохранения нового сервера
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'ip' => 'required',
            'game_port' => 'required|integer',
            'query_port' => 'required|integer',
            'zid' => 'nullable|integer|max:255',
            'visible' => 'required|boolean',
        ]);

        Server::create($request->all());

        return redirect()->back()->with('success', 'Успех.');
    }

    // Метод для редактирования сервера
    public function edit(Server $server)
    {
        return inertia('Dashboard/Servers/Edit', [
            'server' => $server
        ]);
    }

    // Метод для обновления данных сервера
    public function update(Request $request, Server $server)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'ip' => 'required',

            'game_port' => 'required|integer',
            'query_port' => 'required|integer',
            'zid' => 'nullable|integer|max:255',
            'visible' => 'required|boolean',
        ]);

        $server->update($request->all());

        return redirect()->back()->with('success', 'Успех.');
    }

    // Метод для удаления сервера
    public function destroy(Server $server)
    {
        $server->delete();

        return redirect()->back()->with('success', 'Успех.');
    }
}
