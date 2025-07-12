class ApiConfig {
  // Backend Environment Options
  static const String PRODUCTION = 'production';
  static const String LOCAL = 'local';
  static const String CUSTOM = 'custom';

  // Current environment - change this to switch backends
  static const String currentEnvironment = PRODUCTION;

  // Backend URLs
  static const Map<String, String> backendUrls = {
    PRODUCTION: 'https://payment-dashboard-z1s2.onrender.com/api',
    LOCAL: 'http://localhost:3002/api',
    CUSTOM: 'https://your-custom-backend.com/api', // Replace with your URL
  };

  // Get current backend URL
  static String get baseUrl {
    return backendUrls[currentEnvironment] ?? backendUrls[PRODUCTION]!;
  }

  // Backend information
  static const Map<String, Map<String, String>> backendInfo = {
    PRODUCTION: {
      'name': 'Production Backend',
      'description': 'Live backend hosted on Render with MongoDB Atlas',
      'status': 'Always available',
      'features': 'Shared database, No setup required',
    },
    LOCAL: {
      'name': 'Local Development',
      'description': 'Backend running on your local machine',
      'status': 'Requires local setup',
      'features': 'Full control, Custom database',
    },
    CUSTOM: {
      'name': 'Custom Backend',
      'description': 'Your own deployed backend instance',
      'status': 'Custom deployment required',
      'features': 'Your infrastructure, Full control',
    },
  };

  // Get current backend info
  static Map<String, String> get currentBackendInfo {
    return backendInfo[currentEnvironment] ?? backendInfo[PRODUCTION]!;
  }

  // Check if using production backend
  static bool get isProduction => currentEnvironment == PRODUCTION;

  // Check if using local backend
  static bool get isLocal => currentEnvironment == LOCAL;

  // Check if using custom backend
  static bool get isCustom => currentEnvironment == CUSTOM;
}
