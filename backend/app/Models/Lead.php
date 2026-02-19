<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lead extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'branch_id',
        'assigned_to',
        'first_name',
        'last_name',
        'email',
        'phone',
        'alternate_phone',
        'date_of_birth',
        'gender',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'grade_applying_for',
        'previous_school',
        'academic_year',
        'parent_name',
        'parent_phone',
        'parent_email',
        'parent_occupation',
        'relationship',
        'source',
        'referral_name',
        'status',
        'priority',
        'next_follow_up_date',
        'notes',
        'converted_to_student_id',
        'converted_at',
        'custom_fields',
        'estimated_fee',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'next_follow_up_date' => 'date',
        'converted_at' => 'datetime',
        'custom_fields' => 'array',
        'estimated_fee' => 'decimal:2',
    ];

    protected $appends = ['full_name'];

    /**
     * Status constants
     */
    const STATUS_NEW = 'new';
    const STATUS_CONTACTED = 'contacted';
    const STATUS_QUALIFIED = 'qualified';
    const STATUS_VISIT_SCHEDULED = 'visit_scheduled';
    const STATUS_VISITED = 'visited';
    const STATUS_APPLICATION_SUBMITTED = 'application_submitted';
    const STATUS_ENROLLED = 'enrolled';
    const STATUS_NOT_INTERESTED = 'not_interested';
    const STATUS_LOST = 'lost';

    /**
     * Source constants
     */
    const SOURCE_WEBSITE = 'website';
    const SOURCE_REFERRAL = 'referral';
    const SOURCE_WALK_IN = 'walk-in';
    const SOURCE_PHONE = 'phone';
    const SOURCE_SOCIAL_MEDIA = 'social_media';
    const SOURCE_ADVERTISEMENT = 'advertisement';

    /**
     * Get the branch that owns the lead.
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Get the user assigned to this lead.
     */
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get the student this lead was converted to.
     */
    public function convertedToStudent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'converted_to_student_id');
    }

    /**
     * Get the followups for the lead.
     */
    public function followups(): HasMany
    {
        return $this->hasMany(LeadFollowup::class);
    }

    /**
     * Get the status history for the lead.
     */
    public function statusHistory(): HasMany
    {
        return $this->hasMany(LeadStatusHistory::class);
    }

    /**
     * Get the full name attribute.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Check if lead is converted.
     */
    public function isConverted(): bool
    {
        return $this->status === self::STATUS_ENROLLED && $this->converted_to_student_id !== null;
    }

    /**
     * Check if lead needs follow-up.
     */
    public function needsFollowUp(): bool
    {
        return $this->next_follow_up_date && 
               $this->next_follow_up_date->lte(now()) &&
               !$this->isConverted();
    }

    /**
     * Get leads that need follow-up today.
     */
    public static function scopeNeedsFollowUpToday($query)
    {
        return $query->whereDate('next_follow_up_date', '<=', now())
                     ->whereNotIn('status', [self::STATUS_ENROLLED, self::STATUS_LOST, self::STATUS_NOT_INTERESTED]);
    }

    /**
     * Get active leads (not converted or lost).
     */
    public static function scopeActive($query)
    {
        return $query->whereNotIn('status', [self::STATUS_ENROLLED, self::STATUS_LOST, self::STATUS_NOT_INTERESTED]);
    }

    /**
     * Get converted leads.
     */
    public static function scopeConverted($query)
    {
        return $query->where('status', self::STATUS_ENROLLED)
                     ->whereNotNull('converted_to_student_id');
    }

    /**
     * Filter by branch.
     */
    public static function scopeForBranch($query, $branchId)
    {
        return $query->where('branch_id', $branchId);
    }

    /**
     * Filter by assigned user.
     */
    public static function scopeAssignedTo($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }
}
