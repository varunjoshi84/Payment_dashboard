import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/auth_provider.dart';
import '../providers/payment_provider.dart';
import '../models/payment.dart';
import '../widgets/payment_pie_chart.dart';
import 'create_payment_screen.dart';
import 'login_screen.dart';
import 'backend_info_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String? _statusFilter;
  String? _methodFilter;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  void _loadData() {
    final paymentProvider = Provider.of<PaymentProvider>(
      context,
      listen: false,
    );
    paymentProvider.loadPayments(status: _statusFilter, method: _methodFilter);
    paymentProvider.loadStats();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment Dashboard v2.0'),
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadData),
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) async {
              if (value == 'backend_info') {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const BackendInfoScreen(),
                  ),
                );
              } else if (value == 'logout') {
                await authProvider.logout();
                if (mounted) {
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(
                      builder: (context) => const LoginScreen(),
                    ),
                  );
                }
              }
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: 'backend_info',
                child: Row(
                  children: [
                    Icon(Icons.dns, color: Colors.blue.shade600),
                    const SizedBox(width: 8),
                    const Text('Backend Info'),
                  ],
                ),
              ),
              PopupMenuItem(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(Icons.logout, color: Colors.red.shade600),
                    const SizedBox(width: 8),
                    Text(
                      'Logout',
                      style: TextStyle(color: Colors.red.shade600),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.of(context)
              .push(
                MaterialPageRoute(
                  builder: (context) => const CreatePaymentScreen(),
                ),
              )
              .then((_) => _loadData());
        },
        backgroundColor: Colors.blue.shade600,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: Consumer<PaymentProvider>(
        builder: (context, paymentProvider, child) {
          return RefreshIndicator(
            onRefresh: () async => _loadData(),
            child: CustomScrollView(
              slivers: [
                // Stats Section
                if (paymentProvider.stats != null) ...[
                  SliverToBoxAdapter(
                    child: Container(
                      margin: const EdgeInsets.all(16),
                      child: _buildStatsCards(paymentProvider),
                    ),
                  ),
                ],

                // Pie Charts Section
                if (paymentProvider.payments.isNotEmpty) ...[
                  SliverToBoxAdapter(
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 16),
                      child: _buildPieChartsSection(paymentProvider.payments),
                    ),
                  ),
                ],

                // Filters Section
                SliverToBoxAdapter(
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16),
                    child: _buildFilters(),
                  ),
                ),

                // Payments List
                if (paymentProvider.isLoading) ...[
                  const SliverToBoxAdapter(
                    child: Center(
                      child: Padding(
                        padding: EdgeInsets.all(32.0),
                        child: CircularProgressIndicator(),
                      ),
                    ),
                  ),
                ] else if (paymentProvider.error != null) ...[
                  SliverToBoxAdapter(
                    child: Container(
                      margin: const EdgeInsets.all(16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        border: Border.all(color: Colors.red.shade200),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            Icons.error,
                            color: Colors.red.shade600,
                            size: 48,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Error: ${paymentProvider.error}',
                            style: TextStyle(color: Colors.red.shade600),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  ),
                ] else if (paymentProvider.payments.isEmpty) ...[
                  SliverToBoxAdapter(
                    child: Container(
                      margin: const EdgeInsets.all(16),
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        children: [
                          Icon(
                            Icons.payment,
                            size: 64,
                            color: Colors.grey.shade400,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'No payments found',
                            style: Theme.of(context).textTheme.titleLarge
                                ?.copyWith(color: Colors.grey.shade600),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Create your first payment or seed sample data',
                            style: TextStyle(color: Colors.grey.shade600),
                          ),
                        ],
                      ),
                    ),
                  ),
                ] else ...[
                  SliverList(
                    delegate: SliverChildBuilderDelegate((context, index) {
                      final payment = paymentProvider.payments[index];
                      return _buildPaymentCard(payment);
                    }, childCount: paymentProvider.payments.length),
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatsCards(PaymentProvider paymentProvider) {
    final stats = paymentProvider.stats!;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Overview',
          style: Theme.of(
            context,
          ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        LayoutBuilder(
          builder: (context, constraints) {
            if (constraints.maxWidth < 500) {
              // Stack stat cards vertically on very small screens
              return Column(
                children: [
                  _buildStatCard(
                    'Total Amount',
                    '₹${NumberFormat('#,##0.00').format(stats.totalAmount)}',
                    Icons.currency_rupee,
                    Colors.green,
                  ),
                  const SizedBox(height: 8),
                  _buildStatCard(
                    'Total Payments',
                    '${stats.totalPayments}',
                    Icons.payment,
                    Colors.blue,
                  ),
                ],
              );
            } else {
              // Side by side on larger screens
              return Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Total Amount',
                      '₹${NumberFormat('#,##0.00').format(stats.totalAmount)}',
                      Icons.currency_rupee,
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard(
                      'Total Payments',
                      '${stats.totalPayments}',
                      Icons.payment,
                      Colors.blue,
                    ),
                  ),
                ],
              );
            }
          },
        ),
        const SizedBox(height: 12),
        LayoutBuilder(
          builder: (context, constraints) {
            if (constraints.maxWidth < 600) {
              // Stack status cards vertically on small screens
              return Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          'Completed',
                          '${stats.completedPayments}',
                          Icons.check_circle,
                          Colors.green,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildStatCard(
                          'Pending',
                          '${stats.pendingPayments}',
                          Icons.schedule,
                          Colors.orange,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  _buildStatCard(
                    'Failed',
                    '${stats.failedPayments}',
                    Icons.error,
                    Colors.red,
                  ),
                ],
              );
            } else {
              // All three side by side on larger screens
              return Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Completed',
                      '${stats.completedPayments}',
                      Icons.check_circle,
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildStatCard(
                      'Pending',
                      '${stats.pendingPayments}',
                      Icons.schedule,
                      Colors.orange,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildStatCard(
                      'Failed',
                      '${stats.failedPayments}',
                      Icons.error,
                      Colors.red,
                    ),
                  ),
                ],
              );
            }
          },
        ),
      ],
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color, size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    title,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Colors.grey.shade600,
                    ),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: color,
              ),
              overflow: TextOverflow.ellipsis,
              maxLines: 1,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilters() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Filters',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            // Fixed: Use Column on smaller screens, Row on larger screens
            LayoutBuilder(
              builder: (context, constraints) {
                if (constraints.maxWidth < 600) {
                  // Stack filters vertically on small screens
                  return Column(
                    children: [
                      DropdownButtonFormField<String>(
                        decoration: const InputDecoration(
                          labelText: 'Status',
                          border: OutlineInputBorder(),
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                        ),
                        value: _statusFilter,
                        items: [
                          const DropdownMenuItem(
                            value: null,
                            child: Text('All Statuses'),
                          ),
                          const DropdownMenuItem(
                            value: 'pending',
                            child: Text('Pending'),
                          ),
                          const DropdownMenuItem(
                            value: 'completed',
                            child: Text('Completed'),
                          ),
                          const DropdownMenuItem(
                            value: 'failed',
                            child: Text('Failed'),
                          ),
                        ],
                        onChanged: (value) {
                          setState(() {
                            _statusFilter = value;
                          });
                          _loadData();
                        },
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        decoration: const InputDecoration(
                          labelText: 'Method',
                          border: OutlineInputBorder(),
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                        ),
                        value: _methodFilter,
                        items: [
                          const DropdownMenuItem(
                            value: null,
                            child: Text('All Methods'),
                          ),
                          const DropdownMenuItem(
                            value: 'credit-card',
                            child: Text('Credit Card'),
                          ),
                          const DropdownMenuItem(
                            value: 'debit-card',
                            child: Text('Debit Card'),
                          ),
                          const DropdownMenuItem(
                            value: 'upi',
                            child: Text('UPI'),
                          ),
                          const DropdownMenuItem(
                            value: 'bank-transfer',
                            child: Text('Bank Transfer'),
                          ),
                        ],
                        onChanged: (value) {
                          setState(() {
                            _methodFilter = value;
                          });
                          _loadData();
                        },
                      ),
                    ],
                  );
                } else {
                  // Use Row layout on larger screens
                  return Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          decoration: const InputDecoration(
                            labelText: 'Status',
                            border: OutlineInputBorder(),
                            contentPadding: EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 8,
                            ),
                          ),
                          value: _statusFilter,
                          items: [
                            const DropdownMenuItem(
                              value: null,
                              child: Text('All Statuses'),
                            ),
                            const DropdownMenuItem(
                              value: 'pending',
                              child: Text('Pending'),
                            ),
                            const DropdownMenuItem(
                              value: 'completed',
                              child: Text('Completed'),
                            ),
                            const DropdownMenuItem(
                              value: 'failed',
                              child: Text('Failed'),
                            ),
                          ],
                          onChanged: (value) {
                            setState(() {
                              _statusFilter = value;
                            });
                            _loadData();
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          decoration: const InputDecoration(
                            labelText: 'Method',
                            border: OutlineInputBorder(),
                            contentPadding: EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 8,
                            ),
                          ),
                          value: _methodFilter,
                          items: [
                            const DropdownMenuItem(
                              value: null,
                              child: Text('All Methods'),
                            ),
                            const DropdownMenuItem(
                              value: 'credit-card',
                              child: Text('Credit Card'),
                            ),
                            const DropdownMenuItem(
                              value: 'debit-card',
                              child: Text('Debit Card'),
                            ),
                            const DropdownMenuItem(
                              value: 'upi',
                              child: Text('UPI'),
                            ),
                            const DropdownMenuItem(
                              value: 'bank-transfer',
                              child: Text('Bank Transfer'),
                            ),
                          ],
                          onChanged: (value) {
                            setState(() {
                              _methodFilter = value;
                            });
                            _loadData();
                          },
                        ),
                      ),
                    ],
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentCard(Payment payment) {
    Color statusColor;
    IconData statusIcon;

    switch (payment.status.toLowerCase()) {
      case 'completed':
        statusColor = Colors.green;
        statusIcon = Icons.check_circle;
        break;
      case 'failed':
        statusColor = Colors.red;
        statusIcon = Icons.error;
        break;
      case 'pending':
      default:
        statusColor = Colors.orange;
        statusIcon = Icons.schedule;
    }

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: CircleAvatar(
          backgroundColor: statusColor.withOpacity(0.1),
          child: Icon(statusIcon, color: statusColor),
        ),
        title: Text(
          '₹${NumberFormat('#,##0.00').format(payment.amount)}',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              payment.description,
              overflow: TextOverflow.ellipsis,
              maxLines: 2,
            ),
            const SizedBox(height: 4),
            // Fixed: Use Wrap instead of Row to prevent overflow
            Wrap(
              spacing: 8,
              runSpacing: 4,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.credit_card,
                      size: 16,
                      color: Colors.grey.shade600,
                    ),
                    const SizedBox(width: 4),
                    Flexible(
                      child: Text(
                        payment.method.replaceAll('_', ' ').toUpperCase(),
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 12,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.schedule, size: 16, color: Colors.grey.shade600),
                    const SizedBox(width: 4),
                    Flexible(
                      child: Text(
                        DateFormat('MMM d, y').format(payment.createdAt),
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 12,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        trailing: Container(
          constraints: const BoxConstraints(maxWidth: 80),
          child: FittedBox(
            fit: BoxFit.scaleDown,
            child: Chip(
              label: Text(
                payment.status.toUpperCase(),
                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                overflow: TextOverflow.ellipsis,
              ),
              backgroundColor: statusColor.withOpacity(0.1),
              labelStyle: TextStyle(color: statusColor),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPieChartsSection(List<Payment> payments) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Analytics',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        LayoutBuilder(
          builder: (context, constraints) {
            // On larger screens, show charts side by side
            if (constraints.maxWidth > 800) {
              return Row(
                children: [
                  Expanded(
                    child: PaymentPieChart(
                      payments: payments,
                      chartType: 'status',
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: PaymentPieChart(
                      payments: payments,
                      chartType: 'method',
                    ),
                  ),
                ],
              );
            } else {
              // On smaller screens, stack charts vertically
              return Column(
                children: [
                  PaymentPieChart(
                    payments: payments,
                    chartType: 'status',
                  ),
                  const SizedBox(height: 12),
                  PaymentPieChart(
                    payments: payments,
                    chartType: 'method',
                  ),
                ],
              );
            }
          },
        ),
        const SizedBox(height: 16),
      ],
    );
  }
}
