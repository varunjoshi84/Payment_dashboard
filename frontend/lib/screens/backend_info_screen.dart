import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../config/api_config.dart';
import '../services/api_service.dart';

class BackendInfoScreen extends StatefulWidget {
  const BackendInfoScreen({super.key});

  @override
  State<BackendInfoScreen> createState() => _BackendInfoScreenState();
}

class _BackendInfoScreenState extends State<BackendInfoScreen> {
  bool _isConnected = false;
  bool _isChecking = false;
  String? _connectionError;

  @override
  void initState() {
    super.initState();
    _checkConnection();
  }

  Future<void> _checkConnection() async {
    setState(() {
      _isChecking = true;
      _connectionError = null;
    });

    try {
      // Try to make a simple API call to check connection
      await ApiService.getToken();
      setState(() {
        _isConnected = true;
        _isChecking = false;
      });
    } catch (e) {
      setState(() {
        _isConnected = false;
        _connectionError = e.toString();
        _isChecking = false;
      });
    }
  }

  void _copyToClipboard(String text) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Copied to clipboard!'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final backendInfo = ApiConfig.currentBackendInfo;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Backend Connection'),
        backgroundColor: Colors.blue.shade600,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _checkConnection,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _checkConnection,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Connection Status Card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            _isChecking
                                ? Icons.sync
                                : _isConnected
                                ? Icons.check_circle
                                : Icons.error,
                            color: _isChecking
                                ? Colors.orange
                                : _isConnected
                                ? Colors.green
                                : Colors.red,
                            size: 24,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Connection Status',
                            style: Theme.of(context).textTheme.titleLarge
                                ?.copyWith(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        _isChecking
                            ? 'Checking connection...'
                            : _isConnected
                            ? 'Connected successfully'
                            : 'Connection failed',
                        style: TextStyle(
                          color: _isChecking
                              ? Colors.orange
                              : _isConnected
                              ? Colors.green
                              : Colors.red,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      if (_connectionError != null) ...[
                        const SizedBox(height: 8),
                        Text(
                          'Error: $_connectionError',
                          style: TextStyle(
                            color: Colors.red.shade600,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Current Backend Info
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Current Backend',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      _buildInfoRow('Name', backendInfo['name']!),
                      _buildInfoRow('Description', backendInfo['description']!),
                      _buildInfoRow('Status', backendInfo['status']!),
                      _buildInfoRow('Features', backendInfo['features']!),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Text(
                            'URL: ',
                            style: TextStyle(
                              fontWeight: FontWeight.w500,
                              color: Colors.grey.shade700,
                            ),
                          ),
                          Expanded(
                            child: Text(
                              ApiConfig.baseUrl,
                              style: const TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 12,
                              ),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.copy, size: 16),
                            onPressed: () =>
                                _copyToClipboard(ApiConfig.baseUrl),
                            tooltip: 'Copy URL',
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Backend Options
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Available Backend Options',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Production Option
                      _buildBackendOption(
                        'Production Backend',
                        'https://payment-dashboard-z1s2.onrender.com/api',
                        'Recommended for most users',
                        Icons.cloud,
                        Colors.blue,
                        ApiConfig.isProduction,
                      ),

                      const Divider(),

                      // Local Option
                      _buildBackendOption(
                        'Local Development',
                        'http://localhost:3002/api',
                        'For developers and customization',
                        Icons.computer,
                        Colors.green,
                        ApiConfig.isLocal,
                      ),

                      const Divider(),

                      // Custom Option
                      _buildBackendOption(
                        'Custom Backend',
                        'Your own deployed backend',
                        'Deploy your own instance',
                        Icons.settings,
                        Colors.orange,
                        ApiConfig.isCustom,
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // How to Switch
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'How to Switch Backends',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        '1. Edit frontend/lib/config/api_config.dart\n'
                        '2. Change currentEnvironment to:\n'
                        '   • ApiConfig.PRODUCTION (default)\n'
                        '   • ApiConfig.LOCAL\n'
                        '   • ApiConfig.CUSTOM\n'
                        '3. For custom backends, update the URL in backendUrls\n'
                        '4. Restart the Flutter app',
                        style: TextStyle(
                          color: Colors.grey.shade700,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Quick Actions
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Quick Actions',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: _checkConnection,
                          icon: const Icon(Icons.refresh),
                          label: const Text('Test Connection'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue.shade600,
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () => _copyToClipboard(ApiConfig.baseUrl),
                          icon: const Icon(Icons.copy),
                          label: const Text('Copy Backend URL'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.grey.shade600,
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              '$label:',
              style: TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey.shade700,
              ),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  Widget _buildBackendOption(
    String name,
    String url,
    String description,
    IconData icon,
    Color color,
    bool isActive,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      name,
                      style: const TextStyle(fontWeight: FontWeight.w500),
                    ),
                    if (isActive) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.green.shade100,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'ACTIVE',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.green.shade700,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                Text(
                  description,
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                ),
                if (url.startsWith('http')) ...[
                  const SizedBox(height: 4),
                  Text(
                    url,
                    style: TextStyle(
                      color: Colors.grey.shade500,
                      fontSize: 10,
                      fontFamily: 'monospace',
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
