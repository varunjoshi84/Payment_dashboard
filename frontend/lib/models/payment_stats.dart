class PaymentStats {
  final double totalAmount;
  final int totalPayments;
  final int completedPayments;
  final int pendingPayments;
  final int failedPayments;

  PaymentStats({
    required this.totalAmount,
    required this.totalPayments,
    required this.completedPayments,
    required this.pendingPayments,
    required this.failedPayments,
  });

  factory PaymentStats.fromJson(Map<String, dynamic> json) {
    return PaymentStats(
      totalAmount: (json['totalAmount'] ?? 0).toDouble(),
      totalPayments: json['totalPayments'] ?? 0,
      completedPayments: json['completedPayments'] ?? 0,
      pendingPayments: json['pendingPayments'] ?? 0,
      failedPayments: json['failedPayments'] ?? 0,
    );
  }
}
