import 'package:flutter/material.dart';
import '../models/payment.dart';
import '../models/payment_stats.dart';
import '../services/api_service.dart';

class PaymentProvider with ChangeNotifier {
  List<Payment> _payments = [];
  PaymentStats? _stats;
  bool _isLoading = false;
  String? _error;

  List<Payment> get payments => _payments;
  PaymentStats? get stats => _stats;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadPayments({String? status, String? method}) async {
    _setLoading(true);
    _error = null;

    try {
      print('Loading payments with filters: status=$status, method=$method');
      _payments = await ApiService.getPayments(status: status, method: method);
      print('Loaded ${_payments.length} payments from backend');
      notifyListeners();
    } catch (e) {
      print('Backend failed, using demo data: $e');
      // Fallback to demo data if backend fails
      _payments = _generateDemoPayments();
      // Apply filters to demo data
      _payments = _applyFilters(_payments, status: status, method: method);
      print('Using ${_payments.length} demo payments after filtering');
      notifyListeners();
    } finally {
      _setLoading(false);
    }
  }

  List<Payment> _applyFilters(
    List<Payment> payments, {
    String? status,
    String? method,
  }) {
    List<Payment> filtered = payments;

    if (status != null) {
      filtered = filtered.where((payment) => payment.status == status).toList();
    }

    if (method != null) {
      filtered = filtered.where((payment) => payment.method == method).toList();
    }

    return filtered;
  }

  Future<void> loadStats() async {
    try {
      _stats = await ApiService.getPaymentStats();
      notifyListeners();
    } catch (e) {
      // Fallback to demo stats if backend fails
      _stats = PaymentStats(
        totalAmount: 25750.00,
        totalPayments: 15,
        completedPayments: 8,
        pendingPayments: 4,
        failedPayments: 3,
      );
      notifyListeners();
    }
  }

  List<Payment> _generateDemoPayments() {
    return [
      Payment(
        id: '1',
        userId: 'demo-user-id',
        amount: 1250.00,
        status: 'completed',
        method: 'credit-card',
        description: 'Monthly subscription payment',
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
      ),
      Payment(
        id: '2',
        userId: 'demo-user-id',
        amount: 890.50,
        status: 'pending',
        method: 'upi',
        description: 'Product purchase - Electronics',
        createdAt: DateTime.now().subtract(const Duration(hours: 5)),
      ),
      Payment(
        id: '3',
        userId: 'demo-user-id',
        amount: 2100.00,
        status: 'completed',
        method: 'bank-transfer',
        description: 'Service fee payment',
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
      ),
      Payment(
        id: '4',
        userId: 'demo-user-id',
        amount: 345.75,
        status: 'failed',
        method: 'debit-card',
        description: 'Failed transaction - insufficient funds',
        createdAt: DateTime.now().subtract(const Duration(hours: 12)),
      ),
      Payment(
        id: '5',
        userId: 'demo-user-id',
        amount: 5500.00,
        status: 'completed',
        method: 'credit-card',
        description: 'Large purchase - Equipment',
        createdAt: DateTime.now().subtract(const Duration(days: 3)),
      ),
    ];
  }

  Future<bool> createPayment({
    required double amount,
    required String method,
    required String description,
  }) async {
    _setLoading(true);
    _error = null;

    try {
      final payment = await ApiService.createPayment(
        amount: amount,
        method: method,
        description: description,
      );
      _payments.insert(0, payment);
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> seedPayments() async {
    try {
      await ApiService.seedPayments();
      await loadPayments();
      await loadStats();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
