<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $categories = Category::query()
            ->when($search, fn ($query) => $query->where('name', 'like', "%$search%"))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('dashboard/categories', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'zid' => 'nullable',
            'icon' => 'nullable',
            'name' => 'nullable',
            'visible' => 'nullable',
        ]);

        Category::create($data);

        return redirect()->back()->with('success', 'Успех.');
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'zid' => 'nullable',
            'icon' => 'nullable',
            'name' => 'nullable',
            'visible' => 'nullable',
        ]);

        $category->update($data);

        return redirect()->back()->with('success', 'Успех.');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->back()->with('success', 'Успех.');
    }
}
