<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mainBranch = Branch::where('code', 'MAIN')->first();

        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@anabatsms.com',
            'phone' => '+1234567890',
            'password' => Hash::make('password'),
            'branch_id' => $mainBranch ? $mainBranch->id : null,
            'status' => 'active',
        ]);

        $admin->assignRole('Super Admin');

        // Create a branch admin
        $branchAdmin = User::create([
            'name' => 'Branch Admin',
            'email' => 'branchadmin@anabatsms.com',
            'phone' => '+1234567891',
            'password' => Hash::make('password'),
            'branch_id' => $mainBranch ? $mainBranch->id : null,
            'status' => 'active',
        ]);

        $branchAdmin->assignRole('Branch Admin');

        // Create a teacher
        $teacher = User::create([
            'name' => 'John Teacher',
            'email' => 'teacher@anabatsms.com',
            'phone' => '+1234567892',
            'password' => Hash::make('password'),
            'branch_id' => $mainBranch ? $mainBranch->id : null,
            'status' => 'active',
        ]);

        $teacher->assignRole('Teacher');
    }
}
