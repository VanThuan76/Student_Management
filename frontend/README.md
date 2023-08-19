# Document Guide

## Before code

1. Nodejs 16+
2. Npm
3. Enable tsLint, prettier in your edior. (Notice setting prettier file path refer to <b>.prettierrc</b>)

## Techstack

- reactJs + vite
- antd v5
- redux
- react-query
- tailwind-css

## Run

- install lib: `npm install`
- start dev: `npm run dev`

## Tổ chức code : 
- main : trang cấu hình reactJs để start
- pages : các trang web chính
- shared :
    - components : 
        -   business : các component theo nghiệp vụ
        -   icons : icon export từ figma về thành file svg 
        -   layout : Page Layout
    - config : cấu hình axios để thực hiện gọi API(sửa api gọi ở đây)
    - contants : hằng số
    - layout : layout dùng chung trong các trang web
    - routes : quản lý router trong Frontend(bao gồm ngăn chặn, phân quyền)
    - services : gồm các services api được quản lý theo từng mục giống cách viết của các BE khác
    - stores: quản lý state(REDUX)
    - typeDef : để khai bảo cái dto, entity trong các table(schema) từng mục
    - mocks : để mockup dữ liệu sử dụng fake(kiểm tra)
    - utils: 
        - cookies : Thực hiện với cookies client
        - formValidator : Validate các form
        - localStorage: Thực hiện với local storage client
- styles : các file style 
        