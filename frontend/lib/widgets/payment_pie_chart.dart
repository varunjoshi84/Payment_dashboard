import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../models/payment.dart';

class PaymentPieChart extends StatefulWidget {
  final List<Payment> payments;
  final String chartType; // 'status' or 'method'

  const PaymentPieChart({
    super.key,
    required this.payments,
    this.chartType = 'status',
  });

  @override
  State<PaymentPieChart> createState() => _PaymentPieChartState();
}

class _PaymentPieChartState extends State<PaymentPieChart> {
  int touchedIndex = -1;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  widget.chartType == 'status' 
                      ? 'Payment Status Distribution' 
                      : 'Payment Method Distribution',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${widget.payments.length} payments',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.blue.shade700,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            widget.payments.isEmpty
                ? _buildEmptyState()
                : _buildChart(),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      height: 200,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.pie_chart_outline,
              size: 48,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 8),
            Text(
              'No payments to display',
              style: TextStyle(
                color: Colors.grey.shade600,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChart() {
    final data = _getChartData();
    
    return LayoutBuilder(
      builder: (context, constraints) {
        final isSmallScreen = constraints.maxWidth < 600;
        
        return Column(
          children: [
            // Pie Chart
            SizedBox(
              height: isSmallScreen ? 200 : 250,
              child: Row(
                children: [
                  Expanded(
                    flex: isSmallScreen ? 3 : 2,
                    child: PieChart(
                      PieChartData(
                        pieTouchData: PieTouchData(
                          touchCallback: (FlTouchEvent event, pieTouchResponse) {
                            setState(() {
                              if (!event.isInterestedForInteractions ||
                                  pieTouchResponse == null ||
                                  pieTouchResponse.touchedSection == null) {
                                touchedIndex = -1;
                                return;
                              }
                              touchedIndex = pieTouchResponse
                                  .touchedSection!.touchedSectionIndex;
                            });
                          },
                        ),
                        borderData: FlBorderData(show: false),
                        sectionsSpace: 2,
                        centerSpaceRadius: isSmallScreen ? 30 : 40,
                        sections: _buildPieChartSections(data),
                      ),
                    ),
                  ),
                  if (!isSmallScreen) ...[
                    const SizedBox(width: 20),
                    Expanded(
                      flex: 1,
                      child: _buildLegend(data, isSmallScreen),
                    ),
                  ],
                ],
              ),
            ),
            
            // Legend for small screens
            if (isSmallScreen) ...[
              const SizedBox(height: 16),
              _buildLegend(data, isSmallScreen),
            ],
          ],
        );
      },
    );
  }

  List<PieChartSectionData> _buildPieChartSections(Map<String, ChartData> data) {
    return data.entries.map((entry) {
      final index = data.keys.toList().indexOf(entry.key);
      final isTouched = index == touchedIndex;
      final fontSize = isTouched ? 16.0 : 14.0;
      final radius = isTouched ? 65.0 : 55.0;

      return PieChartSectionData(
        color: entry.value.color,
        value: entry.value.value.toDouble(),
        title: '${entry.value.percentage.toStringAsFixed(1)}%',
        radius: radius,
        titleStyle: TextStyle(
          fontSize: fontSize,
          fontWeight: FontWeight.bold,
          color: Colors.white,
          shadows: [
            Shadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 2,
            ),
          ],
        ),
      );
    }).toList();
  }

  Widget _buildLegend(Map<String, ChartData> data, bool isSmallScreen) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      children: data.entries.map((entry) {
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 16,
                height: 16,
                decoration: BoxDecoration(
                  color: entry.value.color,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(width: 8),
              Flexible(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      entry.key,
                      style: TextStyle(
                        fontSize: isSmallScreen ? 12 : 14,
                        fontWeight: FontWeight.w500,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      '${entry.value.value} (${entry.value.percentage.toStringAsFixed(1)}%)',
                      style: TextStyle(
                        fontSize: isSmallScreen ? 10 : 12,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Map<String, ChartData> _getChartData() {
    final Map<String, int> counts = {};
    
    for (final payment in widget.payments) {
      final key = widget.chartType == 'status' 
          ? _formatStatus(payment.status)
          : _formatMethod(payment.method);
      counts[key] = (counts[key] ?? 0) + 1;
    }

    final total = widget.payments.length;
    final Map<String, ChartData> result = {};

    counts.forEach((key, value) {
      final percentage = (value / total) * 100;
      final color = widget.chartType == 'status'
          ? _getStatusColor(key)
          : _getMethodColor(key);
      
      result[key] = ChartData(
        value: value,
        percentage: percentage,
        color: color,
      );
    });

    return result;
  }

  String _formatStatus(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return status.toUpperCase();
    }
  }

  String _formatMethod(String method) {
    switch (method.toLowerCase()) {
      case 'upi':
        return 'UPI';
      case 'card':
      case 'credit-card':
      case 'debit-card':
        return 'Card';
      case 'bank_transfer':
      case 'bank-transfer':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
      default:
        return method.replaceAll('_', ' ').replaceAll('-', ' ').toUpperCase();
    }
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'failed':
        return Colors.red;
      default:
        return Colors.blue;
    }
  }

  Color _getMethodColor(String method) {
    switch (method.toLowerCase()) {
      case 'upi':
        return Colors.purple;
      case 'card':
        return Colors.blue;
      case 'bank transfer':
        return Colors.teal;
      case 'cash':
        return Colors.amber;
      default:
        return Colors.grey;
    }
  }
}

class ChartData {
  final int value;
  final double percentage;
  final Color color;

  ChartData({
    required this.value,
    required this.percentage,
    required this.color,
  });
}
