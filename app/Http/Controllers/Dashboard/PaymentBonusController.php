<?php


namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;

use App\Models\PaymentBonus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentBonusController extends Controller
{
    public function index(Request $request)
    {
        $bonuses = PaymentBonus::query()
            ->when($request->search, function ($query) use ($request) {
                $query->where('min_amount', 'like', '%' . $request->search . '%');
            })
            ->paginate(10);

        return inertia('dashboard/bonuses', [
            'bonuses' => $bonuses,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('PaymentBonus/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'min_amount' => 'required|numeric|min:0',
            'bonus_percent' => 'required|numeric|min:0|max:100',
        ]);

        PaymentBonus::create([
            'min_amount' => $request->min_amount,
            'bonus_percent' => $request->bonus_percent,
        ]);

        return redirect()->route('payment_bonuses.index');
    }

    public function edit(PaymentBonus $paymentBonus)
    {
        return Inertia::render('PaymentBonus/Edit', [
            'bonus' => $paymentBonus,
        ]);
    }

    public function update(Request $request, PaymentBonus $paymentBonus)
    {
        $request->validate([
            'min_amount' => 'required|numeric|min:0',
            'bonus_percent' => 'required|numeric|min:0|max:100',
        ]);

        $paymentBonus->update([
            'min_amount' => $request->min_amount,
            'bonus_percent' => $request->bonus_percent,
        ]);

        return redirect()->route('payment_bonuses.index');
    }

    public function destroy(PaymentBonus $paymentBonus)
    {
        $paymentBonus->delete();

        return redirect()->route('payment_bonuses.index');
    }
}
