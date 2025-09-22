# API Test Script
Write-Host "Testing API Endpoints..." -ForegroundColor Green

$baseUrl = "https://pro-baww.onrender.com/api"

# Test 1: Health Check (if available)
Write-Host "`n1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET
    Write-Host "✓ Health Check: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ Health Check: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get All Companies
Write-Host "`n2. Testing Get All Companies..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/companies" -Method GET
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ Get Companies: $($response.StatusCode) - Found $($data.Count) companies" -ForegroundColor Green
    $companyId = $data[0]._id
} catch {
    Write-Host "✗ Get Companies: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Specific Company
Write-Host "`n3. Testing Get Specific Company..." -ForegroundColor Yellow
if ($companyId) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/companies/$companyId" -Method GET
        Write-Host "✓ Get Company by ID: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Get Company by ID: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: Create New Company
Write-Host "`n4. Testing Create Company..." -ForegroundColor Yellow
$newCompany = @{
    companyName = "API Test Company"
    location = "Test Location"
    foundedOn = "2024-01-01"
    city = "Test City"
    logo = "https://example.com/logo.png"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/companies" -Method POST -Body $newCompany -ContentType "application/json"
    $createdCompany = $response.Content | ConvertFrom-Json
    $newCompanyId = $createdCompany._id
    Write-Host "✓ Create Company: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ Create Company: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Update Company
Write-Host "`n5. Testing Update Company..." -ForegroundColor Yellow
if ($newCompanyId) {
    $updateData = @{
        companyName = "Updated API Test Company"
        location = "Updated Test Location"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/companies/$newCompanyId" -Method PUT -Body $updateData -ContentType "application/json"
        Write-Host "✓ Update Company: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Update Company: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 6: Create Review
Write-Host "`n6. Testing Create Review..." -ForegroundColor Yellow
if ($newCompanyId) {
    $reviewData = @{
        fullName = "API Test Reviewer"
        subject = "API Test Review"
        reviewText = "This is a test review created via API"
        rating = 5
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/reviews/$newCompanyId" -Method POST -Body $reviewData -ContentType "application/json"
        Write-Host "✓ Create Review: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Create Review: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 7: Get Reviews
Write-Host "`n7. Testing Get Reviews..." -ForegroundColor Yellow
if ($newCompanyId) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/reviews/$newCompanyId" -Method GET
        $reviews = $response.Content | ConvertFrom-Json
        Write-Host "✓ Get Reviews: $($response.StatusCode) - Found $($reviews.Count) reviews" -ForegroundColor Green
    } catch {
        Write-Host "✗ Get Reviews: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 8: Error Handling - Invalid Company ID
Write-Host "`n8. Testing Error Handling..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/companies/invalid" -Method GET
    Write-Host "✗ Invalid ID should return error: $($response.StatusCode)" -ForegroundColor Red
} catch {
    Write-Host "✓ Invalid ID properly handled: $($_.Exception.Response.StatusCode)" -ForegroundColor Green
}

# Test 9: Error Handling - Missing Required Fields
Write-Host "`n9. Testing Validation..." -ForegroundColor Yellow
$invalidData = @{ companyName = "Test" } | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/companies" -Method POST -Body $invalidData -ContentType "application/json"
    Write-Host "✗ Missing fields should return error: $($response.StatusCode)" -ForegroundColor Red
} catch {
    Write-Host "✓ Missing fields properly handled: $($_.Exception.Response.StatusCode)" -ForegroundColor Green
}

# Test 10: CORS Preflight
Write-Host "`n10. Testing CORS..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/companies" -Method OPTIONS
    Write-Host "✓ CORS Preflight: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ CORS Preflight: $($_.Exception.Message)" -ForegroundColor Red
}

# Cleanup - Delete Test Company
Write-Host "`n11. Cleanup..." -ForegroundColor Yellow
if ($newCompanyId) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/companies/$newCompanyId" -Method DELETE
        Write-Host "✓ Cleanup completed: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Cleanup failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nAPI Testing Complete!" -ForegroundColor Green