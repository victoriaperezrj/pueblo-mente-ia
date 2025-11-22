/**
 * Reports Service - PDF and Excel Export Functionality
 *
 * This service provides comprehensive reporting capabilities for all ERP modules:
 * - Accounts Receivable reports
 * - Stock Control reports
 * - Treasury reports
 * - Business Insights reports
 *
 * Export formats: PDF, Excel (XLSX), CSV
 *
 * Dependencies required:
 * npm install jspdf jspdf-autotable xlsx
 */

import type { Client, Product, AccountMovement } from './erpService';
import type { TreasuryAccount, TreasuryMovement } from './erpService';

// =====================================================
// TYPES
// =====================================================

export interface ReportConfig {
  title: string;
  subtitle?: string;
  filename: string;
  companyName?: string;
  reportDate?: string;
  includeTimestamp?: boolean;
}

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

// =====================================================
// EXCEL EXPORT SERVICE
// =====================================================

class ExcelExportService {
  /**
   * Export data to Excel file
   */
  async exportToExcel<T extends Record<string, any>>(
    data: T[],
    columns: ExcelColumn[],
    config: ReportConfig
  ): Promise<void> {
    try {
      // Dynamic import to reduce bundle size
      const XLSX = await import('xlsx');

      // Prepare data for export
      const exportData = data.map(row => {
        const exportRow: Record<string, any> = {};
        columns.forEach(col => {
          exportRow[col.header] = row[col.key] ?? '';
        });
        return exportRow;
      });

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

      // Set column widths
      ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }));

      // Generate filename with timestamp if needed
      const filename = config.includeTimestamp
        ? `${config.filename}_${new Date().toISOString().split('T')[0]}.xlsx`
        : `${config.filename}.xlsx`;

      // Download file
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      // Fallback to CSV
      this.exportToCSV(data, columns, config);
    }
  }

  /**
   * Export data to CSV (fallback)
   */
  exportToCSV<T extends Record<string, any>>(
    data: T[],
    columns: ExcelColumn[],
    config: ReportConfig
  ): void {
    // Create CSV header
    const headers = columns.map(col => col.header).join(',');

    // Create CSV rows
    const rows = data.map(row => {
      return columns.map(col => {
        const value = row[col.key] ?? '';
        // Escape commas and quotes
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    });

    // Combine header and rows
    const csv = [headers, ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const filename = config.includeTimestamp
      ? `${config.filename}_${new Date().toISOString().split('T')[0]}.csv`
      : `${config.filename}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// =====================================================
// PDF EXPORT SERVICE
// =====================================================

class PDFExportService {
  /**
   * Export data to PDF file
   */
  async exportToPDF<T extends Record<string, any>>(
    data: T[],
    columns: ExcelColumn[],
    config: ReportConfig
  ): Promise<void> {
    try {
      // Dynamic import to reduce bundle size
      const jsPDF = (await import('jspdf')).default;
      const autoTable = (await import('jspdf-autotable')).default;

      // Create PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text(config.title, 14, 22);

      // Add subtitle
      if (config.subtitle) {
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(config.subtitle, 14, 30);
      }

      // Add company name and date
      doc.setFontSize(9);
      doc.setTextColor(150);
      const dateText = config.reportDate || new Date().toLocaleDateString('es-AR');
      doc.text(dateText, 14, config.subtitle ? 36 : 30);

      if (config.companyName) {
        doc.text(config.companyName, 14, config.subtitle ? 40 : 34);
      }

      // Prepare table data
      const tableColumns = columns.map(col => col.header);
      const tableRows = data.map(row =>
        columns.map(col => String(row[col.key] ?? ''))
      );

      // Add table
      (doc as any).autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: config.companyName ? 45 : (config.subtitle ? 40 : 35),
        theme: 'grid',
        headStyles: {
          fillColor: [79, 70, 229], // Indigo
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });

      // Generate filename with timestamp if needed
      const filename = config.includeTimestamp
        ? `${config.filename}_${new Date().toISOString().split('T')[0]}.pdf`
        : `${config.filename}.pdf`;

      // Download file
      doc.save(filename);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Error al generar PDF. Intenta exportar a Excel o CSV.');
    }
  }
}

// =====================================================
// REPORTS SERVICE
// =====================================================

class ReportsService {
  private excelService = new ExcelExportService();
  private pdfService = new PDFExportService();

  /**
   * Export Clients Report
   */
  async exportClientsReport(clients: Client[], format: 'excel' | 'pdf' | 'csv' = 'excel'): Promise<void> {
    const columns: ExcelColumn[] = [
      { header: 'Nombre', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Teléfono', key: 'phone', width: 15 },
      { header: 'CUIT', key: 'tax_id', width: 15 },
      { header: 'Saldo Actual', key: 'current_balance', width: 15 },
      { header: 'Límite Crédito', key: 'credit_limit', width: 15 },
      { header: 'Estado', key: 'is_active', width: 10 }
    ];

    const data = clients.map(client => ({
      ...client,
      current_balance: `$${client.current_balance.toLocaleString()}`,
      credit_limit: `$${client.credit_limit.toLocaleString()}`,
      is_active: client.is_active ? 'Activo' : 'Inactivo'
    }));

    const config: ReportConfig = {
      title: 'Reporte de Clientes',
      subtitle: 'Cuentas Corrientes',
      filename: 'reporte_clientes',
      includeTimestamp: true
    };

    if (format === 'pdf') {
      await this.pdfService.exportToPDF(data, columns, config);
    } else if (format === 'csv') {
      this.excelService.exportToCSV(data, columns, config);
    } else {
      await this.excelService.exportToExcel(data, columns, config);
    }
  }

  /**
   * Export Account Movements Report
   */
  async exportAccountMovementsReport(
    movements: AccountMovement[],
    clientName: string,
    format: 'excel' | 'pdf' | 'csv' = 'excel'
  ): Promise<void> {
    const columns: ExcelColumn[] = [
      { header: 'Fecha', key: 'document_date', width: 12 },
      { header: 'Tipo', key: 'document_type', width: 15 },
      { header: 'Número', key: 'document_number', width: 12 },
      { header: 'Descripción', key: 'description', width: 30 },
      { header: 'Debe', key: 'debit', width: 12 },
      { header: 'Haber', key: 'credit', width: 12 },
      { header: 'Saldo', key: 'balance', width: 12 }
    ];

    const data = movements.map(mov => ({
      ...mov,
      document_date: new Date(mov.document_date).toLocaleDateString('es-AR'),
      debit: mov.debit > 0 ? `$${mov.debit.toLocaleString()}` : '-',
      credit: mov.credit > 0 ? `$${mov.credit.toLocaleString()}` : '-',
      balance: `$${mov.balance.toLocaleString()}`
    }));

    const config: ReportConfig = {
      title: 'Cuenta Corriente',
      subtitle: clientName,
      filename: `cuenta_corriente_${clientName.replace(/\s+/g, '_')}`,
      includeTimestamp: true
    };

    if (format === 'pdf') {
      await this.pdfService.exportToPDF(data, columns, config);
    } else if (format === 'csv') {
      this.excelService.exportToCSV(data, columns, config);
    } else {
      await this.excelService.exportToExcel(data, columns, config);
    }
  }

  /**
   * Export Products/Stock Report
   */
  async exportProductsReport(products: Product[], format: 'excel' | 'pdf' | 'csv' = 'excel'): Promise<void> {
    const columns: ExcelColumn[] = [
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Precio Costo', key: 'cost_price', width: 12 },
      { header: 'Precio Venta', key: 'sale_price', width: 12 },
      { header: 'Stock Actual', key: 'current_stock', width: 12 },
      { header: 'Stock Mínimo', key: 'min_stock', width: 12 },
      { header: 'Unidad', key: 'unit', width: 10 },
      { header: 'Estado', key: 'is_active', width: 10 }
    ];

    const data = products.map(product => ({
      ...product,
      cost_price: `$${product.cost_price.toLocaleString()}`,
      sale_price: `$${product.sale_price.toLocaleString()}`,
      is_active: product.is_active ? 'Activo' : 'Inactivo'
    }));

    const config: ReportConfig = {
      title: 'Reporte de Inventario',
      subtitle: 'Control de Stock',
      filename: 'reporte_inventario',
      includeTimestamp: true
    };

    if (format === 'pdf') {
      await this.pdfService.exportToPDF(data, columns, config);
    } else if (format === 'csv') {
      this.excelService.exportToCSV(data, columns, config);
    } else {
      await this.excelService.exportToExcel(data, columns, config);
    }
  }

  /**
   * Export Treasury Accounts Report
   */
  async exportTreasuryAccountsReport(
    accounts: TreasuryAccount[],
    format: 'excel' | 'pdf' | 'csv' = 'excel'
  ): Promise<void> {
    const columns: ExcelColumn[] = [
      { header: 'Nombre', key: 'name', width: 25 },
      { header: 'Tipo', key: 'account_type', width: 15 },
      { header: 'Banco', key: 'bank_name', width: 20 },
      { header: 'Número Cuenta', key: 'account_number', width: 20 },
      { header: 'Moneda', key: 'currency', width: 10 },
      { header: 'Saldo Actual', key: 'current_balance', width: 15 },
      { header: 'Estado', key: 'is_active', width: 10 }
    ];

    const data = accounts.map(account => ({
      ...account,
      account_type: this.formatAccountType(account.account_type),
      current_balance: `$${account.current_balance.toLocaleString()}`,
      is_active: account.is_active ? 'Activa' : 'Inactiva'
    }));

    const config: ReportConfig = {
      title: 'Reporte de Tesorería',
      subtitle: 'Cuentas y Saldos',
      filename: 'reporte_tesoreria',
      includeTimestamp: true
    };

    if (format === 'pdf') {
      await this.pdfService.exportToPDF(data, columns, config);
    } else if (format === 'csv') {
      this.excelService.exportToCSV(data, columns, config);
    } else {
      await this.excelService.exportToExcel(data, columns, config);
    }
  }

  /**
   * Export Treasury Movements Report
   */
  async exportTreasuryMovementsReport(
    movements: TreasuryMovement[],
    accountName: string,
    format: 'excel' | 'pdf' | 'csv' = 'excel'
  ): Promise<void> {
    const columns: ExcelColumn[] = [
      { header: 'Fecha', key: 'movement_date', width: 12 },
      { header: 'Tipo', key: 'movement_type', width: 15 },
      { header: 'Categoría', key: 'category', width: 20 },
      { header: 'Descripción', key: 'description', width: 30 },
      { header: 'Beneficiario', key: 'payee', width: 20 },
      { header: 'Monto', key: 'amount', width: 15 },
      { header: 'Saldo', key: 'balance_after', width: 15 }
    ];

    const data = movements.map(mov => ({
      ...mov,
      movement_date: new Date(mov.movement_date).toLocaleDateString('es-AR'),
      movement_type: this.formatMovementType(mov.movement_type),
      amount: `$${mov.amount.toLocaleString()}`,
      balance_after: `$${mov.balance_after.toLocaleString()}`
    }));

    const config: ReportConfig = {
      title: 'Movimientos de Tesorería',
      subtitle: accountName,
      filename: `movimientos_${accountName.replace(/\s+/g, '_')}`,
      includeTimestamp: true
    };

    if (format === 'pdf') {
      await this.pdfService.exportToPDF(data, columns, config);
    } else if (format === 'csv') {
      this.excelService.exportToCSV(data, columns, config);
    } else {
      await this.excelService.exportToExcel(data, columns, config);
    }
  }

  /**
   * Export Business Summary Report
   */
  async exportBusinessSummaryReport(
    summary: {
      totalBalance: number;
      totalReceivables: number;
      totalPayables: number;
      stockValue: number;
      netPosition: number;
      clientsCount: number;
      productsCount: number;
    },
    format: 'excel' | 'pdf' | 'csv' = 'excel'
  ): Promise<void> {
    const columns: ExcelColumn[] = [
      { header: 'Métrica', key: 'metric', width: 30 },
      { header: 'Valor', key: 'value', width: 20 }
    ];

    const data = [
      { metric: 'Efectivo Total', value: `$${summary.totalBalance.toLocaleString()}` },
      { metric: 'Cuentas por Cobrar', value: `$${summary.totalReceivables.toLocaleString()}` },
      { metric: 'Cuentas por Pagar', value: `$${summary.totalPayables.toLocaleString()}` },
      { metric: 'Valor de Stock', value: `$${summary.stockValue.toLocaleString()}` },
      { metric: 'Posición Neta', value: `$${summary.netPosition.toLocaleString()}` },
      { metric: 'Cantidad de Clientes', value: summary.clientsCount.toString() },
      { metric: 'Cantidad de Productos', value: summary.productsCount.toString() }
    ];

    const config: ReportConfig = {
      title: 'Resumen Ejecutivo del Negocio',
      subtitle: 'Métricas Principales',
      filename: 'resumen_ejecutivo',
      includeTimestamp: true
    };

    if (format === 'pdf') {
      await this.pdfService.exportToPDF(data, columns, config);
    } else if (format === 'csv') {
      this.excelService.exportToCSV(data, columns, config);
    } else {
      await this.excelService.exportToExcel(data, columns, config);
    }
  }

  // Helper methods
  private formatAccountType(type: string): string {
    const types: Record<string, string> = {
      cash: 'Efectivo',
      bank: 'Banco',
      digital_wallet: 'Billetera Digital'
    };
    return types[type] || type;
  }

  private formatMovementType(type: string): string {
    const types: Record<string, string> = {
      income: 'Ingreso',
      expense: 'Egreso',
      transfer_in: 'Transferencia Entrada',
      transfer_out: 'Transferencia Salida'
    };
    return types[type] || type;
  }
}

// =====================================================
// EXPORT INSTANCE
// =====================================================

export const reportsService = new ReportsService();
