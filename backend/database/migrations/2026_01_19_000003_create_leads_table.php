<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained()->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            
            // Personal Information
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('alternate_phone')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            
            // Address
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->default('Pakistan');
            
            // Academic Information
            $table->string('grade_applying_for')->nullable();
            $table->string('previous_school')->nullable();
            $table->string('academic_year')->nullable();
            
            // Parent/Guardian Information
            $table->string('parent_name');
            $table->string('parent_phone');
            $table->string('parent_email')->nullable();
            $table->string('parent_occupation')->nullable();
            $table->string('relationship')->default('parent'); // parent, guardian, other
            
            // Lead Information
            $table->string('source')->nullable(); // website, referral, walk-in, phone, social_media, advertisement
            $table->string('referral_name')->nullable();
            $table->enum('status', [
                'new',
                'contacted',
                'qualified',
                'visit_scheduled',
                'visited',
                'application_submitted',
                'enrolled',
                'not_interested',
                'lost'
            ])->default('new');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            
            // Follow-up
            $table->date('next_follow_up_date')->nullable();
            $table->text('notes')->nullable();
            
            // Conversion
            $table->foreignId('converted_to_student_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('converted_at')->nullable();
            
            // Metadata
            $table->json('custom_fields')->nullable();
            $table->decimal('estimated_fee', 10, 2)->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['branch_id', 'status']);
            $table->index(['assigned_to', 'status']);
            $table->index('next_follow_up_date');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
