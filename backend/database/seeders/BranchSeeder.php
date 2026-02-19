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
        // Main Branch
        $mainBranch = Branch::create([
            'name' => 'Main Branch',
            'code' => 'MAIN',
            'address' => '123 Main Street, City, Country',
            'contact_info' => [
                'phone' => '+1234567890',
                'email' => 'main@anabatsms.com',
                'fax' => '+1234567891',
                'website' => 'https://main.anabatsms.com',
            ],
            'status' => 'active',
        ]);

        // Set default settings for main branch
        $mainBranch->setSetting('academic_year', '2024-2025');
        $mainBranch->setSetting('timezone', 'UTC');
        $mainBranch->setSetting('currency', 'USD');
        $mainBranch->setSetting('date_format', 'Y-m-d');
        $mainBranch->setSetting('time_format', 'H:i:s');
        $mainBranch->setSetting('max_students_per_class', '30');
        $mainBranch->setSetting('enable_online_payment', 'true');
        $mainBranch->setSetting('enable_sms_notifications', 'true');

        // Secondary Branch
        $secondaryBranch = Branch::create([
            'name' => 'Secondary Branch',
            'code' => 'SEC',
            'address' => '456 Secondary Street, City, Country',
            'contact_info' => [
                'phone' => '+0987654321',
                'email' => 'secondary@anabatsms.com',
                'fax' => '+0987654322',
                'website' => 'https://secondary.anabatsms.com',
            ],
            'status' => 'active',
        ]);

        // Set default settings for secondary branch
        $secondaryBranch->setSetting('academic_year', '2024-2025');
        $secondaryBranch->setSetting('timezone', 'UTC');
        $secondaryBranch->setSetting('currency', 'USD');
        $secondaryBranch->setSetting('date_format', 'Y-m-d');
        $secondaryBranch->setSetting('time_format', 'H:i:s');
        $secondaryBranch->setSetting('max_students_per_class', '25');
        $secondaryBranch->setSetting('enable_online_payment', 'false');
        $secondaryBranch->setSetting('enable_sms_notifications', 'true');

        // North Branch
        $northBranch = Branch::create([
            'name' => 'North Branch',
            'code' => 'NORTH',
            'address' => '789 North Avenue, City, Country',
            'contact_info' => [
                'phone' => '+1122334455',
                'email' => 'north@anabatsms.com',
                'website' => 'https://north.anabatsms.com',
            ],
            'status' => 'active',
        ]);

        // Set default settings for north branch
        $northBranch->setSetting('academic_year', '2024-2025');
        $northBranch->setSetting('timezone', 'UTC');
        $northBranch->setSetting('currency', 'USD');
        $northBranch->setSetting('date_format', 'Y-m-d');
        $northBranch->setSetting('time_format', 'H:i:s');
        $northBranch->setSetting('max_students_per_class', '35');
        $northBranch->setSetting('enable_online_payment', 'true');
        $northBranch->setSetting('enable_sms_notifications', 'false');
    }
}
