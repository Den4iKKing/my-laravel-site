<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;

use App\Models\Promocode;
use Illuminate\Http\Request;

class PromoController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $promocodes = Promocode::where('code', 'like', "%{$search}%")
            ->paginate(10);

        return inertia('dashboard/promocode', [
            'promocodes' => $promocodes,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return inertia('Dashboard/Promocodes/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:255|unique:promo_codes,code',
            'type' => 'required|in:bonus_balance,deposit_bonus',
            'value' => 'required|numeric|min:0',
            'max_uses' => 'required|integer|min:0',
            'used' => 'required|integer|min:0',
        ]);

        Promocode::create($request->all());

        return redirect()->back()->with('success', 'Промокод успешно создан.');
    }

    public function edit(Promocode $promocode)
    {
        return inertia('Dashboard/Promocodes/Edit', [
            'promocode' => $promocode
        ]);
    }

    public function update(Request $request, Promocode $promocode)
    {
        $request->validate([
            'code' => 'required|string|max:255|unique:promo_codes,code,' . $promocode->id,
            'type' => 'required|in:bonus_balance,bonus_deposit',
            'value' => 'required|numeric|min:0',
            'max_uses' => 'required|integer|min:0',
            'used' => 'required|integer|min:0',
        ]);

        $promocode->update($request->all());

        return redirect()->back()->with('success', 'Промокод успешно обновлен.');
    }

    public function destroy(Promocode $promocode)
    {
        $promocode->delete();

        return redirect()->back()->with('success', 'Промокод успешно удален.');
    }
}
