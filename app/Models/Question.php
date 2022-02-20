<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $table = 'learn_questions';

    protected $fillable = [
        'name',
        'active',
        'type',
        'point',
    ];

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
