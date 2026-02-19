<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserActivity extends Model
{
    use HasFactory;

    /**
     * Indicates if the model should be timestamped.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'activity_type',
        'ip_address',
        'user_agent',
        'description',
        'metadata',
        'created_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Get the user that owns the activity.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Activity type constants.
     */
    const TYPE_LOGIN = 'login';
    const TYPE_LOGOUT = 'logout';
    const TYPE_PASSWORD_RESET = 'password_reset';
    const TYPE_PASSWORD_CHANGE = 'password_change';
    const TYPE_PROFILE_UPDATE = 'profile_update';
    const TYPE_EMAIL_CHANGE = 'email_change';
    const TYPE_STATUS_CHANGE = 'status_change';
    const TYPE_ROLE_ASSIGNED = 'role_assigned';
    const TYPE_ROLE_REMOVED = 'role_removed';
    const TYPE_PERMISSION_GRANTED = 'permission_granted';
    const TYPE_PERMISSION_REVOKED = 'permission_revoked';
    const TYPE_FAILED_LOGIN = 'failed_login';
    const TYPE_ACCOUNT_LOCKED = 'account_locked';
    const TYPE_ACCOUNT_UNLOCKED = 'account_unlocked';
}
