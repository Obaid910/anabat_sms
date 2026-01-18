<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Branch::create([
            'name' => 'Main Branch',
            'code' => 'MAIN',
            'address' => '123 Main Street, City, Country',
            'contact_info' => [
                'phone' => '+1234567890',
                'email' => 'main@anabatsms.com',
            ],
            'status' => 'active',
        ]);

        Branch::create([
            'name' => 'Secondary Branch',
            'code' => 'SEC',
            'address' => '456 Secondary Street, City, Country',
            'contact_info' => [
                'phone' => '+0987654321',
                'email' => 'secondary@anabatsms.com',
            ],
            'status' => 'active',
        ]);
    }
}
