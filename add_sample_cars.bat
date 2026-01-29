@echo off
REM Script to add sample cars to Cars24 MongoDB database

setlocal enabledelayedexpansion

REM Car 1
echo Adding Car 1: Maruti Suzuki Swift...
curl -X POST http://localhost:5203/api/Car ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"2023 Maruti Suzuki Swift VXI\",\"images\":[\"https://search.brave.com/images?q=Maruti+Suzuki+swift+pexel.com&context=W3sic3JjIjoiaHR0cHM6Ly93d3cuY2FyYW5kYmlrZS5jb20vX25leHQvaW1hZ2U_dXJsPWh0dHBzOi8vaW1hZ2VzLmNhcmFuZGJpa2UuY29tL2Nhci1pbWFnZXMvZ2FsbGVyeS9tYXJ1dGktc3V6dWtpL3N3aWZ0L2V4dGVyaW9yL21hcnV0aV9zdXp1a2lfc3dpZnRfcmlkZXZpZXdfMTIuanBnJnc9MjU2JnE9NzUiLCJ0ZXh0IjoiTWFydXRpIFN1enVraSBTd2lmdCBSaWRldmlldyAxMiIsInBhZ2VfdXJsIjoiaHR0cHM6Ly93d3cuY2FyYW5kYmlrZS5jb20vbWFydXRpLXN1enVraS1jYXJzL3N3aWZ0L2ltYWdlcyJ9XQ%3D%3D&sig=e5718ada5148df24e0a4579d383cef6a69d3502b14c11cb52e13a766112e688e&nonce=832c2f651c485069c49cc8f1e5419235&source=imageCluster"],\"price\":\"₹6.80 lakh\",\"emi\":\"₹8,245/m\",\"location\":\"Rohini, New Delhi\",\"specs\":{\"year\":2023,\"km\":\"15,000\",\"fuel\":\"Petrol\",\"transmission\":\"Manual\",\"owner\":\"1st owner\",\"insurance\":\"Comprehensive\"},\"features\":[\"Power Steering\",\"Air Conditioning\",\"ABS\"],\"highlights\":[\"Well maintained\",\"Single owner\"]}"

REM Car 2
echo Adding Car 2: Hyundai Creta...
curl -X POST http://localhost:5203/api/Car ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"2021 Hyundai Creta SX\",\"images\":[\"https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg\"],\"price\":\"₹14.50 lakh\",\"emi\":\"₹18,999/m\",\"location\":\"Gurgaon, Haryana\",\"specs\":{\"year\":2021,\"km\":\"25,000\",\"fuel\":\"Diesel\",\"transmission\":\"Auto\",\"owner\":\"1st owner\",\"insurance\":\"Comprehensive\"},\"features\":[\"Power Steering\",\"Air Conditioning\",\"ABS\",\"Airbags\"],\"highlights\":[\"Well maintained\",\"Regular service\"]}"

REM Car 3
echo Adding Car 3: Tata Nexon...
curl -X POST http://localhost:5203/api/Car ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"2022 Tata Nexon XZ Plus\",\"images\":[\"https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg\"],\"price\":\"₹9.75 lakh\",\"emi\":\"₹12,500/m\",\"location\":\"Noida, UP\",\"specs\":{\"year\":2022,\"km\":\"12,000\",\"fuel\":\"Petrol\",\"transmission\":\"Auto\",\"owner\":\"1st owner\",\"insurance\":\"Comprehensive\"},\"features\":[\"Power Steering\",\"Air Conditioning\",\"ABS\",\"Touchscreen\"],\"highlights\":[\"Excellent condition\",\"Low mileage\"]}"

REM Car 4
echo Adding Car 4: Honda City...
curl -X POST http://localhost:5203/api/Car ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"2020 Honda City VX\",\"images\":[\"https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg\"],\"price\":\"₹10.20 lakh\",\"emi\":\"₹10,500/m\",\"location\":\"Dwarka, New Delhi\",\"specs\":{\"year\":2020,\"km\":\"35,000\",\"fuel\":\"Petrol\",\"transmission\":\"Manual\",\"owner\":\"1st owner\",\"insurance\":\"Comprehensive\"},\"features\":[\"Power Steering\",\"Air Conditioning\",\"Rear Parking Sensor\"],\"highlights\":[\"Single owner\",\"Well serviced\"]}"

REM Car 5
echo Adding Car 5: Maruti Baleno...
curl -X POST http://localhost:5203/api/Car ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"2023 Maruti Baleno Delta\",\"images\":[\"https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg\"],\"price\":\"₹7.80 lakh\",\"emi\":\"₹9,200/m\",\"location\":\"Faridabad, Haryana\",\"specs\":{\"year\":2023,\"km\":\"8,000\",\"fuel\":\"Petrol\",\"transmission\":\"Auto\",\"owner\":\"1st owner\",\"insurance\":\"Comprehensive\"},\"features\":[\"Power Steering\",\"Air Conditioning\",\"ABS\",\"Alloy Wheels\"],\"highlights\":[\"Brand new\",\"Warranty valid\"]}"

REM Car 6
echo Adding Car 6: Hyundai Venue...
curl -X POST http://localhost:5203/api/Car ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"2021 Hyundai Venue SX\",\"images\":[\"https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg\"],\"price\":\"₹9.50 lakh\",\"emi\":\"₹11,800/m\",\"location\":\"Ghaziabad, UP\",\"specs\":{\"year\":2021,\"km\":\"22,000\",\"fuel\":\"Petrol\",\"transmission\":\"Manual\",\"owner\":\"1st owner\",\"insurance\":\"Comprehensive\"},\"features\":[\"Power Steering\",\"Air Conditioning\",\"ABS\"],\"highlights\":[\"Good condition\",\"Regular maintenance\"]}"

echo.
echo All cars added successfully!
pause
