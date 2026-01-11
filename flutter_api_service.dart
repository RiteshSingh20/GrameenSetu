import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

// Replace with your actual base URL
const String baseUrl = 'http://localhost:4000/api/auth';

class ApiService {
  // Request OTP
  static Future<Map<String, dynamic>> requestOtp(String mobile, {String purpose = 'signup'}) async {
    final url = Uri.parse('$baseUrl/otp/request');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'mobile': mobile, 'purpose': purpose}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to request OTP: ${response.body}');
    }
  }


  static Future<Map<String, dynamic>> verifyOtp(String mobile, String code, {String purpose = 'signup'}) async {
    final url = Uri.parse('$baseUrl/otp/verify');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'mobile': mobile, 'code': code, 'purpose': purpose}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to verify OTP: ${response.body}');
    }
  }

  // Register Vendor
  static Future<Map<String, dynamic>> registerVendor({
    required String fullName,
    required String mobile,
    required String email,
    String? password,
    String? preferredLanguage,
    required String businessName,
    required String businessType,
    String? gstNumber,
    String? panNumber,
    required String address,
    required String district,
    required String state,
    required String pincode,
    double? procurementRadiusKm,
    File? registrationDoc,
  }) async {
    final url = Uri.parse('$baseUrl/vendor/signup');
    final request = http.MultipartRequest('POST', url);

    // Add text fields
    request.fields['fullName'] = fullName;
    request.fields['mobile'] = mobile;
    request.fields['email'] = email;
    if (password != null) request.fields['password'] = password;
    if (preferredLanguage != null) request.fields['preferredLanguage'] = preferredLanguage;
    request.fields['businessName'] = businessName;
    request.fields['businessType'] = businessType;
    if (gstNumber != null) request.fields['gstNumber'] = gstNumber;
    if (panNumber != null) request.fields['panNumber'] = panNumber;
    request.fields['address'] = address;
    request.fields['district'] = district;
    request.fields['state'] = state;
    request.fields['pincode'] = pincode;
    if (procurementRadiusKm != null) request.fields['procurementRadiusKm'] = procurementRadiusKm.toString();

    
    if (registrationDoc != null) {
      request.files.add(await http.MultipartFile.fromPath('registrationDoc', registrationDoc.path));
    }

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to register vendor: ${response.body}');
    }
  }
}