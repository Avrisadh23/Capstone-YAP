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
        Schema::table('community_members', function (Blueprint $table) {
            $table->string('role')->default('anggota')->after('user_email'); // 'pengurus' or 'anggota'
        });

        Schema::table('event_participants', function (Blueprint $table) {
            $table->string('role')->default('peserta')->after('user_email'); // 'pengurus' or 'peserta'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('community_members', function (Blueprint $table) {
            $table->dropColumn('role');
        });

        Schema::table('event_participants', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
