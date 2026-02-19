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
        Schema::create('lead_followups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Who did the follow-up
            
            $table->enum('type', [
                'phone_call',
                'email',
                'sms',
                'whatsapp',
                'in_person',
                'video_call',
                'other'
            ]);
            
            $table->enum('status', ['completed', 'scheduled', 'cancelled'])->default('completed');
            
            $table->text('notes');
            $table->text('outcome')->nullable(); // Result of the follow-up
            
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            $table->string('next_action')->nullable();
            $table->date('next_follow_up_date')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['lead_id', 'created_at']);
            $table->index(['user_id', 'scheduled_at']);
            $table->index('next_follow_up_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lead_followups');
    }
};
