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
        Schema::create('pays', function (Blueprint $table) {
            $table->id(); // Chave primária
            $table->foreignId('id_reservation')->constrained('reservations')->onDelete('cascade'); // Chave estrangeira para reservas
            $table->decimal('value', 10, 2); // Valor do pagamento (ex: 100.50)
            $table->enum('status_pay', ['pendente', 'pago', 'reembolsado']); // Status do pagamento
            $table->date('date_pay'); // Data do pagamento
            $table->timestamps(); // Campos created_at e updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pays');
    }
};
