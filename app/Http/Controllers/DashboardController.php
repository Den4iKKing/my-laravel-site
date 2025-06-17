<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\items_lib;
use App\Models\User;
use App\Models\ShopItem;
use App\Models\Server;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function users(Request $request)
    {
        $search = $request->input('search');

        $users = User::query()
            ->when($search, fn ($query) =>
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('steamid', 'like', "%$search%");
            })
            )
            ->orderByDesc('balance') 
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('dashboard/users', [
            'users' => $users,
            'filters' => ['search' => $search],
        ]);
    }


    public function search_into_lib(Request $request)
    {
        $query = items_lib::query();

        if ($request->has('search')) {
            $searchTerm = $request->get('search');
            $query->where('name', 'like', "%{$searchTerm}%")
                ->orWhere('shortname', 'like', "%{$searchTerm}%");
        }

        if ($request->has('category')) {
            $query->where('category', $request->get('category'));
        }

        $items = $query->paginate(50);

        return response()->json([
            'status' => 'success',
            'data' => $items
        ]);
    }


    public function servers()
    {
        $servers = Server::all();
        return Inertia::render('dashboard/servers', compact('servers'));
    }
}
