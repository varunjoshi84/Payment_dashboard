import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../models/payment.dart';
import '../models/payment_stats.dart';

class ApiService {
  // Change this to your backend URL (for demo we'll handle errors gracefully)
  static const String baseUrl = 'http://localhost:3000/api';
  
  static String? _token;

  // Get token from storage
  static Future<String?> getToken() async {
    if (_token != null) return _token;
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    return _token;
  }

  // Save token to storage
  static Future<void> saveToken(String token) async {
    _token = token;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  // Clear token
  static Future<void> clearToken() async {
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }

  // Get headers with token
  static Future<Map<String, String>> getHeaders() async {
    final token = await getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // Auth methods
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      if (data['access_token'] != null) {
        await saveToken(data['access_token']);
      }
      return data;
    } else {
      throw Exception('Login failed: ${response.body}');
    }
  }

  static Future<Map<String, dynamic>> register(String email, String password, String name) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
        'name': name,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      if (data['access_token'] != null) {
        await saveToken(data['access_token']);
      }
      return data;
    } else {
      throw Exception('Registration failed: ${response.body}');
    }
  }

  // User methods
  static Future<List<User>> getUsers() async {
    final headers = await getHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/users'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => User.fromJson(json)).toList();
    } else {
      throw Exception('Failed to get users: ${response.body}');
    }
  }

  // Payment methods
  static Future<List<Payment>> getPayments({String? status, String? method}) async {
    final headers = await getHeaders();
    String url = '$baseUrl/payments';
    
    final queryParams = <String, String>{};
    if (status != null) queryParams['status'] = status;
    if (method != null) queryParams['method'] = method;
    
    if (queryParams.isNotEmpty) {
      url += '?' + Uri(queryParameters: queryParams).query;
    }

    final response = await http.get(
      Uri.parse(url),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Payment.fromJson(json)).toList();
    } else {
      throw Exception('Failed to get payments: ${response.body}');
    }
  }

  static Future<Payment> createPayment({
    required double amount,
    required String method,
    required String description,
  }) async {
    final headers = await getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/payments'),
      headers: headers,
      body: jsonEncode({
        'amount': amount,
        'method': method,
        'description': description,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return Payment.fromJson(data);
    } else {
      throw Exception('Failed to create payment: ${response.body}');
    }
  }

  static Future<PaymentStats> getPaymentStats() async {
    final headers = await getHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/payments/stats'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return PaymentStats.fromJson(data);
    } else {
      throw Exception('Failed to get payment stats: ${response.body}');
    }
  }

  // Seed methods (for testing)
  static Future<void> seedAdminUser() async {
    final response = await http.post(
      Uri.parse('$baseUrl/seed/admin'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to seed admin user: ${response.body}');
    }
  }

  static Future<void> seedPayments() async {
    final headers = await getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/seed/payments'),
      headers: headers,
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to seed payments: ${response.body}');
    }
  }
}
