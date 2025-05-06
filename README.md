# DCM-System

## 🚀 快速開始

### 安裝依賴套件

請先確認已安裝 [pnpm](https://pnpm.io/)，然後執行以下指令安裝依賴：

```bash
pnpm install
```
啟動開發伺服器
```bash
pnpm dev
```
啟動後，開啟瀏覽器前往：

```bash
http://localhost:3000
```
## 1. 項目概述

系統提供設備管理、機架管理、IP地址管理、服務管理等功能，並支持管理員和一般用戶兩種角色。前端使用Next.js框架開發，採用App Router架構，並使用Tailwind CSS進行樣式設計。

## 2. 用戶角色與權限

系統支持兩種用戶角色：

### 2.1 管理員 (Admin)

- 完整的系統管理權限
- 可進行設備安裝、移除、移動等操作
- 可管理IP地址分配
- 可配置數據中心、機房和機架
- 可管理服務和用戶


### 2.2 一般用戶 (User)

- 僅查看權限，無管理權限
- 可查看分配給自己的設備和IP地址
- 可查看服務狀態
- 可進行搜索操作


## 3. 頁面功能與數據需求

### 3.1 登錄頁面

- **功能**：用戶登錄系統
- **數據需求**：

- 驗證用戶名和密碼
- 返回用戶角色和權限信息
- 生成並返回認證令牌





### 3.2 管理員儀表板

#### 3.2.1 儀表板概覽

- **功能**：顯示系統關鍵指標和狀態
- **數據需求**：

- IP地址使用統計（總數、已用、可用）
- 設備使用統計（總數、已用、可用）
- 網絡使用統計（總數、已用、可用）
- 人員使用趨勢數據（按部門分類的時間序列數據）





#### 3.2.2 設備管理

- **功能**：管理數據中心設備
- **數據需求**：

- 設備列表（ID、名稱、型號、狀態、位置、IP地址等）
- 設備詳細信息
- 設備安裝、移除、移動操作的API
- 設備狀態更新API





#### 3.2.3 機架管理

- **功能**：管理數據中心機架
- **數據需求**：

- 機架列表（ID、名稱、位置、容量、使用情況等）
- 機架詳細信息，包括已安裝設備
- 機架可視化數據
- 機架配置更新API





#### 3.2.4 IP管理

- **功能**：管理IP地址分配
- **數據需求**：

- IP地址列表（地址、子網、狀態、分配設備、服務等）
- 子網列表（子網、描述、總IP數、已用IP數、可用IP數等）
- IP地址分配、釋放、更新操作的API
- 子網添加、更新操作的API





#### 3.2.5 服務管理

- **功能**：管理數據中心服務
- **數據需求**：

- 服務列表（ID、名稱、描述、狀態、重要性、擁有者、部門等）
- 服務詳細信息，包括關聯設備和IP地址
- 服務狀態更新API
- 服務配置更新API





#### 3.2.6 搜索功能

- **功能**：全局搜索數據中心資源
- **數據需求**：

- 搜索API，支持按名稱、IP、位置等條件搜索
- 支持高級搜索（設備類型、位置、IP範圍、狀態等過濾條件）
- 搜索結果分類（設備、服務、IP地址）





#### 3.2.7 設置

- **功能**：系統設置和配置
- **數據需求**：

- 用戶設置保存API
- 系統配置獲取和更新API





### 3.3 一般用戶儀表板

#### 3.3.1 用戶儀表板概覽

- **功能**：顯示用戶相關的關鍵指標和狀態
- **數據需求**：

- 可用服務統計
- 分配給用戶的設備統計
- 分配給用戶的IP地址統計
- 人員使用趨勢數據





#### 3.3.2 設備查詢

- **功能**：查看分配給用戶的設備
- **數據需求**：

- 用戶設備列表
- 設備詳細信息（只讀）





#### 3.3.3 IP地址查詢

- **功能**：查看分配給用戶的IP地址
- **數據需求**：

- 用戶IP地址列表
- IP地址詳細信息（只讀）





#### 3.3.4 服務狀態

- **功能**：查看服務狀態
- **數據需求**：

- 服務列表及狀態
- 服務詳細信息（只讀）





#### 3.3.5 搜索功能

- **功能**：搜索用戶可訪問的資源
- **數據需求**：

- 用戶權限範圍內的搜索API
- 支持高級搜索（設備類型、位置、IP範圍、狀態等過濾條件）
- 搜索結果分類（設備、服務、IP地址）





#### 3.3.6 幫助中心

- **功能**：提供系統使用幫助
- **數據需求**：

- 幫助文檔內容
- FAQ數據





## 4. API需求列表

### 4.1 認證API

- `POST /api/auth/login` - 用戶登錄
- `POST /api/auth/logout` - 用戶登出
- `GET /api/auth/user` - 獲取當前用戶信息
- `POST /api/auth/switch-role` - 切換用戶角色


### 4.2 儀表板API

- `GET /api/dashboard/stats` - 獲取儀表板統計數據
- `GET /api/dashboard/personnel-usage` - 獲取人員使用趨勢數據

- 參數：`timeRange`（時間範圍）, `department`（部門）





### 4.3 設備管理API

- `GET /api/devices` - 獲取設備列表

- 參數：`page`, `limit`, `search`, `type`, `status`, `location`



- `GET /api/devices/{id}` - 獲取設備詳情
- `POST /api/devices` - 添加新設備
- `PUT /api/devices/{id}` - 更新設備信息
- `DELETE /api/devices/{id}` - 刪除設備
- `POST /api/devices/{id}/install` - 安裝設備到機架
- `POST /api/devices/{id}/uninstall` - 從機架移除設備
- `POST /api/devices/{id}/move` - 移動設備到其他機架


### 4.4 機架管理API

- `GET /api/racks` - 獲取機架列表

- 參數：`page`, `limit`, `search`, `room`, `datacenter`



- `GET /api/racks/{id}` - 獲取機架詳情
- `POST /api/racks` - 添加新機架
- `PUT /api/racks/{id}` - 更新機架信息
- `DELETE /api/racks/{id}` - 刪除機架
- `GET /api/datacenters` - 獲取數據中心列表
- `GET /api/rooms` - 獲取機房列表

- 參數：`datacenterId`





### 4.5 IP管理API

- `GET /api/ips` - 獲取IP地址列表

- 參數：`page`, `limit`, `search`, `subnet`, `status`



- `GET /api/ips/{id}` - 獲取IP地址詳情
- `POST /api/ips` - 添加新IP地址
- `PUT /api/ips/{id}` - 更新IP地址信息
- `DELETE /api/ips/{id}` - 刪除IP地址
- `POST /api/ips/{id}/assign` - 分配IP地址給設備
- `POST /api/ips/{id}/release` - 釋放IP地址
- `GET /api/subnets` - 獲取子網列表
- `POST /api/subnets` - 添加新子網
- `PUT /api/subnets/{id}` - 更新子網信息
- `DELETE /api/subnets/{id}` - 刪除子網


### 4.6 服務管理API

- `GET /api/services` - 獲取服務列表

- 參數：`page`, `limit`, `search`, `status`, `criticality`



- `GET /api/services/{id}` - 獲取服務詳情
- `POST /api/services` - 添加新服務
- `PUT /api/services/{id}` - 更新服務信息
- `DELETE /api/services/{id}` - 刪除服務
- `PUT /api/services/{id}/status` - 更新服務狀態


### 4.7 搜索API

- `GET /api/search` - 全局搜索

- 參數：`query`, `type`, `deviceType`, `location`, `ipRange`, `status`, `page`, `limit`





### 4.8 用戶管理API

- `GET /api/users` - 獲取用戶列表
- `GET /api/users/{id}` - 獲取用戶詳情
- `POST /api/users` - 添加新用戶
- `PUT /api/users/{id}` - 更新用戶信息
- `DELETE /api/users/{id}` - 刪除用戶
- `PUT /api/users/{id}/role` - 更新用戶角色


## 5. 數據模型與結構

### 5.1 用戶 (User)

```typescript
interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "admin" | "user";
  department?: string;
  createdAt: string;
  lastLogin?: string;
}
```

### 5.2 數據中心 (DataCenter)

```typescript
interface DataCenter {
  id: string;
  name: string;
  location: string;
  rooms: Room[];
}

interface Room {
  id: string;
  name: string;
  dataCenterId: string;
  racks: Rack[];
}

interface Rack {
  id: string;
  name: string;
  roomId: string;
  totalUnits: number;
  units: RackUnit[];
}

interface RackUnit {
  position: number;
  deviceId: string | null;
}
```

### 5.3 設備 (Device)

```typescript
interface Device {
  id: string;
  name: string;
  model: string;
  status: "Active" | "Inactive" | "Maintenance" | "Decommissioned";
  serviceId?: string;
  serviceName?: string;
  location?: {
    dataCenterId: string;
    roomId: string;
    rackId: string;
    position: number;
    size: number;
  };
  ips: IPAddress[];
  installationDate?: string;
  powerConsumption?: number;
  notes?: string;
}
```

### 5.4 IP地址 (IPAddress)

```typescript
interface IPAddress {
  id: string;
  address: string;
  subnet: string;
  status: "Assigned" | "Available" | "Reserved" | "Deprecated";
  deviceId?: string;
  deviceName?: string;
  serviceId?: string;
  serviceName?: string;
  gateway?: string;
  lastUpdated?: string;
}

interface Subnet {
  id: string;
  subnet: string;
  description: string;
  totalIPs: number;
  usedIPs: number;
  availableIPs: number;
  reservedIPs: number;
  gateway?: string;
}
```

### 5.5 服務 (Service)

```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive" | "Maintenance" | "Planned";
  criticality: "Low" | "Medium" | "High" | "Critical";
  owner?: string;
  department?: string;
  devices: string[]; // Device IDs
}
```

## 6. 特殊功能需求

### 6.1 角色切換

- 系統需支持在管理員和一般用戶角色之間切換
- 切換時需保持在功能相似的頁面
- 切換時需更新用戶權限和UI顯示


### 6.2 高級搜索

- 支持多條件組合搜索
- 支持保存搜索條件
- 支持搜索歷史記錄


### 6.3 實時數據更新

- 服務狀態變更時需實時更新UI
- 設備狀態變更時需實時更新UI
- 考慮使用WebSocket或輪詢機制


### 6.4 數據導出

- 支持將搜索結果導出為CSV或Excel格式
- 支持將設備列表、IP地址列表等導出為CSV或Excel格式


### 6.5 批量操作

- 支持批量選擇設備進行操作
- 支持批量分配或釋放IP地址


## 7. 錯誤處理與狀態管理

### 7.1 API錯誤處理

- 所有API響應應包含標準的錯誤格式


```typescript
interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: any;
}
```

### 7.2 狀態碼定義

- 200: 成功
- 400: 請求錯誤
- 401: 未授權
- 403: 禁止訪問
- 404: 資源不存在
- 409: 資源衝突
- 500: 服務器錯誤


### 7.3 認證與授權

- 使用JWT進行認證
- 在請求頭中包含Authorization: Bearer token
- 令牌過期處理機制
- 權限檢查機制


## 8. 前後端交互規範

### 8.1 API響應格式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
```

### 8.2 分頁請求格式

- 使用`page`和`limit`參數進行分頁
- 響應中包含總數和分頁信息


### 8.3 搜索和過濾

- 使用查詢參數進行搜索和過濾
- 複雜過濾條件可使用JSON格式


### 8.4 日期時間格式

- 所有日期時間使用ISO 8601格式 (YYYY-MM-DDTHH:mm:ss.sssZ)
- 時區處理：所有時間都應該是UTC時間，前端負責轉換為本地時間


## 9. 開發與部署注意事項

### 9.1 環境變量

- API基礎URL
- 認證相關配置
- 功能開關


### 9.2 API版本控制

- API路徑中包含版本號，如`/api/v1/devices`
- 版本升級策略


### 9.3 性能考慮

- 大數據集分頁加載
- 數據緩存策略
- 圖片和資源優化
