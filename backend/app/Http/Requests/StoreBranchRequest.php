<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBranchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only Super Admin can create new branches
        return $this->user()->hasRole('Super Admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:branches,code', 'alpha_dash'],
            'address' => ['nullable', 'string', 'max:500'],
            'contact_info' => ['nullable', 'array'],
            'contact_info.phone' => ['nullable', 'string', 'max:20'],
            'contact_info.email' => ['nullable', 'email', 'max:255'],
            'contact_info.fax' => ['nullable', 'string', 'max:20'],
            'contact_info.website' => ['nullable', 'url', 'max:255'],
            'status' => ['nullable', 'in:active,inactive'],
            'settings' => ['nullable', 'array'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Branch name is required.',
            'code.required' => 'Branch code is required.',
            'code.unique' => 'This branch code is already in use.',
            'code.alpha_dash' => 'Branch code can only contain letters, numbers, dashes and underscores.',
            'contact_info.email.email' => 'Please provide a valid email address.',
            'contact_info.website.url' => 'Please provide a valid website URL.',
        ];
    }
}
