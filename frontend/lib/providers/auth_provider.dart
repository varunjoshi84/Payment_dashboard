import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _error = null;
    
    try {
      // Demo mode for testing UI (fallback if backend fails)
      if (email == 'demo@test.com' && password == 'demo123') {
        _user = User(
          id: 'demo-user-id',
          email: email,
          name: 'Demo User',
          role: 'admin',
          createdAt: DateTime.now(),
        );
        notifyListeners();
        return true;
      }
      
      final response = await ApiService.login(email, password);
      if (response['user'] != null) {
        _user = User.fromJson(response['user']);
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      // If backend is not working, allow demo login
      if (email == 'demo@test.com' && password == 'demo123') {
        _user = User(
          id: 'demo-user-id',
          email: email,
          name: 'Demo User',
          role: 'admin',
          createdAt: DateTime.now(),
        );
        notifyListeners();
        return true;
      }
      
      _error = 'Backend connection failed. Use demo@test.com / demo123 for demo mode.';
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> register(String email, String password, String name) async {
    _setLoading(true);
    _error = null;
    
    try {
      final response = await ApiService.register(email, password, name);
      if (response['user'] != null) {
        _user = User.fromJson(response['user']);
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> logout() async {
    _user = null;
    await ApiService.clearToken();
    notifyListeners();
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
