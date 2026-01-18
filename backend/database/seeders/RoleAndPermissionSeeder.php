<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User Management
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Branch Management
            'view branches',
            'create branches',
            'edit branches',
            'delete branches',

            // Role Management
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',

            // Student Management
            'view students',
            'create students',
            'edit students',
            'delete students',

            // Lead Management
            'view leads',
            'create leads',
            'edit leads',
            'delete leads',

            // Attendance Management
            'view attendance',
            'mark attendance',
            'edit attendance',

            // Communication
            'send sms',
            'view sms logs',

            // Exams Management
            'view exams',
            'create exams',
            'edit exams',
            'delete exams',
            'enter marks',

            // Fee Management
            'view fees',
            'create fees',
            'edit fees',
            'delete fees',
            'record payments',

            // HR Management
            'view employees',
            'create employees',
            'edit employees',
            'delete employees',

            // Payroll Management
            'view payroll',
            'process payroll',

            // Accounting
            'view accounts',
            'create transactions',
            'edit transactions',
            'delete transactions',

            // Reports
            'view reports',
            'export reports',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $superAdmin = Role::create(['name' => 'Super Admin']);
        $superAdmin->givePermissionTo(Permission::all());

        $branchAdmin = Role::create(['name' => 'Branch Admin']);
        $branchAdmin->givePermissionTo([
            'view users', 'create users', 'edit users',
            'view students', 'create students', 'edit students', 'delete students',
            'view leads', 'create leads', 'edit leads', 'delete leads',
            'view attendance', 'mark attendance', 'edit attendance',
            'send sms', 'view sms logs',
            'view exams', 'create exams', 'edit exams', 'enter marks',
            'view fees', 'create fees', 'edit fees', 'record payments',
            'view employees', 'create employees', 'edit employees',
            'view reports', 'export reports',
        ]);

        $teacher = Role::create(['name' => 'Teacher']);
        $teacher->givePermissionTo([
            'view students',
            'view attendance', 'mark attendance',
            'view exams', 'enter marks',
            'view reports',
        ]);

        $accountant = Role::create(['name' => 'Accountant']);
        $accountant->givePermissionTo([
            'view students',
            'view fees', 'create fees', 'edit fees', 'record payments',
            'view accounts', 'create transactions', 'edit transactions',
            'view reports', 'export reports',
        ]);

        $dataOperator = Role::create(['name' => 'Data Operator']);
        $dataOperator->givePermissionTo([
            'view students', 'create students', 'edit students',
            'view leads', 'create leads', 'edit leads',
            'view attendance', 'mark attendance',
        ]);
    }
}
