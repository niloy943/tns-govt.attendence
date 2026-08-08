<?php

namespace Database\Seeders;

use App\Models\MowcaOfficer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class MowcaOfficersSeeder extends Seeder
{
    public function run(): void
    {
        $sqlPath = database_path('sql/mowca_officers.sql');
        if (! File::exists($sqlPath)) {
            return;
        }

        $sql = File::get($sqlPath);

        // Truncate existing data to prevent duplicate seeding
        MowcaOfficer::truncate();

        // Regex pattern to capture row tuples inside VALUES (...)
        preg_match_all("/\((?:\s*'(?:[^'\\\\]|\\\\.)*'\s*|\s*NULL\s*)(?:,\s*(?:'(?:[^'\\\\]|\\\\.)*'\s*|\s*NULL\s*))*\)/i", $sql, $matches);

        if (empty($matches[0])) {
            return;
        }

        $rows = [];
        $now = now();

        foreach ($matches[0] as $tuple) {
            // Split tuple into items, preserving escaped commas inside strings
            preg_match_all("/'(?:[^'\\\\]|\\\\.)*'|NULL/i", $tuple, $values);

            if (count($values[0]) >= 13) {
                $clean = array_map(function ($val) {
                    if (strtoupper(trim($val)) === 'NULL') {
                        return null;
                    }
                    $str = trim($val, "'");
                    return str_replace(["\\'", '\\"'], ["'", '"'], $str);
                }, $values[0]);

                $rows[] = [
                    'overall_sl'   => isset($clean[0]) ? (int)$clean[0] : null,
                    'department'   => $clean[1] ?? null,
                    'sl'           => isset($clean[2]) ? (int)$clean[2] : null,
                    'name'         => $clean[3] ?? null,
                    'officer_id'   => $clean[4] ?? null,
                    'designation'  => $clean[5] ?? null,
                    'office'       => $clean[6] ?? null,
                    'email'        => $clean[7] ?? null,
                    'phone_office' => $clean[8] ?? null,
                    'mobile'       => $clean[9] ?? null,
                    'intercom'     => $clean[10] ?? null,
                    'room_no'      => $clean[11] ?? null,
                    'fax'          => $clean[12] ?? null,
                    'created_at'   => $now,
                    'updated_at'   => $now,
                ];
            }
        }

        if (! empty($rows)) {
            foreach (array_chunk($rows, 50) as $chunk) {
                DB::table('mowca_officers')->insert($chunk);
            }
        }
    }
}
