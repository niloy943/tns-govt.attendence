# Standalone Organogram (Hierarchy Chart) Component

This directory contains the fully isolated frontend, backend, and logic code of the Government Organogram / Hierarchy Chart.

## Directory Structure
```
hierarchy-chart-extract/
├── frontend/                     # Standalone React App (Vite)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css             # System and hierarchy card stylesheets
│       ├── components/
│       │   └── layout/
│       │       └── GovtLogo.jsx  # Fallback seal vector graphic
│       ├── context/
│       │   └── AuthContext.jsx   # Mock selection context provider
│       ├── data/
│       │   └── dummy/
│       │       ├── employees.js  # Sample command tree datasets
│       │       └── ministries.js # Sample ministries definitions
│       ├── hooks/
│       │   └── useEmployees.js   # API hook with automatic mock fallback
│       └── pages/
│           └── employee/
│               └── EmployeeChart.jsx # Main hierarchy dashboard
│
├── backend/                      # Clean Laravel PHP backend logic
│   ├── EmployeeController.php    # Server route actions and queries
│   ├── Employee.php              # Eloquent self-referential model mappings
│   ├── api.php                   # Authentication-gated Laravel routing configurations
│   └── migration.php             # Table schema configuration
│
└── README.md                     # Documentation and logic specifications
```

---

## 1. Connection Lines Logic (Mathematical Drawing System)

The organogram uses a CSS-based, responsive vector rendering technique to draw parent-to-subordinate connection lines. This technique relies on absolute positioning coordinates anchored around parent cards and children groups, ensuring layout stability across different screen sizes.

### Mathematical Parameters:
- **Card Width**: Fixed at exactly `250px` (`TreeNodeBranch` element).
- **Line Width**: Exactly `3px` for high readability.
- **Card Gap**: Set at `2rem` (horizontal separation between siblings).

### Component Layout Hierarchy:
```
           +-------------------------+
           |       Parent Card       |
           |     (Width: 250px)      |
           +------------+------------+
                        | 
                        | (Vertical Stem: Height: 24px)
                        | 
                        * (Split Junction Indicator Dot)
  +---------------------+---------------------+
  | (Left Bridge: Half Width)                 | (Right Bridge: Half Width)
  |                                           |
  | (Vertical Drop: 20px)                     | (Vertical Drop: 20px)
  v                                           v
+-------------------+                       +-------------------+
|    Child Card 1   |                       |    Child Card 2   |
|   (Width: 250px)  |                       |   (Width: 250px)  |
+-------------------+                       +-------------------+
```

### The Rendering Pipeline

The connection line elements are generated and aligned using four distinct steps:

#### 1. The Vertical Stem (Parent Output)
A vertical line drop begins at the bottom center of the parent card:
- **Width**: `3px`
- **Height**: `24px`
- **Background**: `#4F46E5`
- **Positioning**: Automatically centered relative to the parent card (`margin: 0 auto`).

#### 2. The Split Junction
At the base of the Vertical Stem sits a junction dot:
- **Dimensions**: `8px` by `8px` circle (`border-radius: 9999px`).
- **Positioning**: Center-aligned at the tail end of the stem.
- **Purpose**: Creates a visual anchor pointing to the split path.

#### 3. The Unbroken Horizontal Bridge
A horizontal bridge spans from the center of the first child card to the center of the last child card.
- **Height**: `3px`
- **Positioning**:
  - `top: 0` (aligned with the junction dot)
  - `left: 125px` (offsets the line starting point by exactly half of the first child's `250px` width)
  - `right: 125px` (offsets the line ending point by exactly half of the last child's `250px` width)
- **CSS Implementation**:
  ```css
  position: absolute;
  top: 0;
  left: 125px;
  right: 125px;
  height: 3px;
  background-color: #4F46E5;
  ```

#### 4. The Vertical Drop (Child Input)
Each child node receives a vertical drop line:
- **Height**: `20px`
- **Positioning**: Placed at `left: 50%` of each individual child wrapper to match card alignment.
- **Top Offset**: `padding-top: 20px` is applied to the child card wrapper to prevent overlap.

---

## 2. Tree Construction & Rendering Logic (Frontend)

The frontend builds the hierarchical structure dynamically on the client side:

1. **Root Nodes Detection**: The component identifies top-level executives by searching for employees whose `reportsTo` field is `null`, or whose supervisor is not present in the current filtered list, or whose `level` is set to `'ceo'`.
   ```javascript
   const rootNodes = useMemo(() => {
     const ids = new Set(employees.map(e => e.id));
     return employees.filter(e => e.reportsTo === null || !ids.has(e.reportsTo) || e.level === 'ceo');
   }, [employees]);
   ```
2. **Recursive Traversal**: Starting from the root nodes, the `<TreeNodeBranch />` component queries for direct subordinates (`reportsTo === node.id`) and recursively renders itself:
   ```javascript
   const children = useMemo(() => {
     return allEmployees.filter(e => e.reportsTo === node.id);
   }, [allEmployees, node.id]);
   ```
3. **Card Styles by Level**: Colors and borders adapt dynamically to clear visual indicators for `ceo`, `vp`/`director`, `manager`, `asst_manager`, and general `staff`.

---

## 3. Database Relations & Backend Schema

The Laravel backend structures the hierarchy using a self-referential Eloquent schema.

### Table Schema:
- `reports_to` column: A foreign key referencing the `id` on the `employees` table itself.
- `level` column: An integer parameter representing the hierarchy depth (e.g., `1` represents the top level, such as Secretary, with lower integers representing junior positions).

### Eloquent Code (`Employee.php`):
```php
/**
 * Direct Supervisor relationship
 */
public function manager(): BelongsTo
{
    return $this->belongsTo(Employee::class, 'reports_to');
}

/**
 * Direct Subordinates relationship
 */
public function subordinates(): HasMany
{
    return $this->hasMany(Employee::class, 'reports_to');
}
```

### Route Endpoint Action:
The route `/api/employees/hierarchy` returns the data structured flat, sorted by `level`. The frontend maps the array into a hashed lookup table to render the recursive structure in constant $O(N)$ time.

---

## How to Run Frontend (Vite + React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   This will start the local server on `http://localhost:3000` with the standalone interactive dashboard loaded.
