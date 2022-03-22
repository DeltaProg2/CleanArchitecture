<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\User;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;
use Enforcer;

class AccessController extends BaseController
{
    public function index()
    {
        return Inertia::render('Admin/Access');
    }

    public function getAllUsers(Request $request)
    {
        if ($request->has('search')) {
            $search = '%' . $request->search . '%';
            $users = User::where('name', 'like', $search)->select('id', 'name')->paginate(10);
        } else {
            $users = User::select('id', 'name')->paginate(10);
        }

        return json_encode($users);
    }

    public function getAllDepartments(Request $request)
    {
        if ($request->has('search')) {
            $search = '%' . $request->search . '%';
            $departments = Department::where('name', 'like', $search)->select('id', 'name')->paginate(10);
        } else {
            $departments = Department::select('id', 'name')->paginate(10);
        }
        return json_encode($departments);
    }

    /**
     * request should have 'resource' and 'actions' fields
    */
    public function getResourceUsers(Request $request)
    {
        // TODO transform this plug into working function
        $resource = $request->resource;
        $actions = json_decode($request->actions);
        $response = [
            Department::select('id', 'name')->first(),
            User::select('id', 'name')->first()
        ];
        return json_encode($response);
    }
}
