### **SQL Clauses, Operators, and Functions**

#### **Clauses**
| Clause      | Usage                                  | Functionality |
|------------|-------------------------------------|--------------|
| **CREATE TABLE** | `CREATE TABLE table_name ...` | Creates a new table |
| **INSERT** | `INSERT INTO table_name ...` | Inserts new data into the table |
| **SELECT** | `SELECT col1, col2 ...` | Retrieves the selected columns |
| **SELECT*** | `SELECT * FROM ...` | Retrieves all columns from a table |
| **FROM** | `FROM table_name` | Specifies the table(s) where data is located |
| **WHERE** | `WHERE col > 5` | Filters rows based on conditions |
| **UPDATE, SET** | `UPDATE table_name SET column1 = value1;` | Updates values in a column (can use WHERE for specific rows) |
| **DELETE** | `DELETE FROM table_name` | Deletes all rows from the table |
| **DROP** | `DROP TABLE table_name` | Deletes the table from the database |
| **ALTER** | `ALTER TABLE table_name ...` | Adds, deletes, or modifies columns in a table |
| **ORDER BY** | `ORDER BY col1 ASC/DESC` | Sorts the table based on column(s) in ascending or descending order |
| **DISTINCT** | `SELECT DISTINCT col, ...` | Retrieves unique values from the column(s) |
| **LIMIT** | `LIMIT 10` | Restricts the number of output rows |
| **OFFSET** | `OFFSET 5` | Specifies the starting position (nth row) for retrieving results |
| **GROUP BY** | `GROUP BY col ...` | Groups rows with the same values in specified columns |
| **HAVING** | `HAVING col > 20` | Filters results after applying GROUP BY |
| **CASE** | `CASE WHEN condition1 THEN value1 WHEN .. ELSE .. END` | Returns a value based on the first met condition |

#### **Operators**
| Operator | Usage | Functionality |
|----------|-------|--------------|
| **<>** | `WHERE col <> 5` | Filters rows where the column is NOT equal to 5 (Other comparison operators: `=`, `>`, `<`, `>=`, `<=`) |
| **LIKE** | `WHERE col LIKE '%Apple%'` | Finds rows where the column contains 'Apple' |
| **AND** | `WHERE col1 > 5 AND col2 < 3` | Retrieves rows that satisfy **both** conditions |
| **OR** | `WHERE col1 > 5 OR col2 < 3` | Retrieves rows that satisfy **at least one** condition |
| **NOT** | `WHERE NOT col = 'Apple'` | Retrieves rows where the condition is **NOT TRUE** |
| **IN** | `WHERE col IN ('Apple', 'Microsoft')` | Retrieves rows where the column value matches any value in the given list |
| **BETWEEN** | `WHERE col BETWEEN 3 AND 5` | Retrieves rows where the column value falls **within the range (inclusive)** |

#### **Functions**
| Function | Usage | Functionality |
|----------|-------|--------------|
| **COUNT()** | `SELECT COUNT(col) ...` | Counts the number of values in the column |
| **SUM()** | `SELECT SUM(col) ...` | Sums all values in the column |
| **MIN()** | `SELECT MIN(col) ...` | Gets the minimum value from the column |
| **MAX()** | `SELECT MAX(col) ...` | Gets the maximum value from the column |
| **AVG()** | `SELECT AVG(col) ...` | Gets the average value from the column |
| **strftime()** | `strftime("%Y", col) ...` | Extracts the **year** from a date column (Can also extract month, day, etc.) |
| **CAST()** | `CAST(col AS datatype) ...` | Converts the column value into a different datatype |
| **FLOOR()** | `FLOOR(col)` | Rounds a number **down** to the nearest integer |
| **CEIL()** | `CEIL(col)` | Rounds a number **up** to the nearest integer |
| **ROUND()** | `ROUND(col, n)` | Rounds a number to `n` decimal places |
| **UPPER()** | `UPPER(col)` | Converts a string to **uppercase** |
| **LOWER()** | `LOWER(col)` | Converts a string to **lowercase** |


