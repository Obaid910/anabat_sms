<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BranchSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'branch_id',
        'setting_key',
        'setting_value',
    ];

    /**
     * Get the branch that owns the setting.
     */
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
