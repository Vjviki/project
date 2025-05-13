🔷 Python String Methods Table
| **Method**          | **Description**                                                          |
| ------------------- | ------------------------------------------------------------------------ |
| `str.upper()`       | Converts all characters to uppercase.                                    |
| `str.lower()`       | Converts all characters to lowercase.                                    |
| `str.title()`       | Converts the first character of each word to uppercase.                  |
| `str.capitalize()`  | Capitalizes the first character of the string.                           |
| `str.strip()`       | Removes leading and trailing whitespace.                                 |
| `str.lstrip()`      | Removes leading whitespace.                                              |
| `str.rstrip()`      | Removes trailing whitespace.                                             |
| `str.replace(a, b)` | Replaces all occurrences of `a` with `b`.                                |
| `str.find(sub)`     | Returns the first index of `sub`, or -1 if not found.                    |
| `str.count(sub)`    | Returns the number of times `sub` appears in the string.                 |
| `str.split(sep)`    | Splits the string into a list by the given separator.                    |
| `str.join(list)`    | Joins a list of strings into one string using the string as a separator. |
| `str.isdigit()`     | Returns `True` if all characters are digits.                             |
| `str.isalpha()`     | Returns `True` if all characters are alphabets.                          |
| `str.isalnum()`     | Returns `True` if all characters are alphanumeric (letters or numbers).  |
| `str.startswith(s)` | Returns `True` if the string starts with `s`.                            |
| `str.endswith(s)`   | Returns `True` if the string ends with `s`.                              |

🔷 Python Data Structures & Methods Table
 List Methods
| **Method**          | **Description**                                          |
| ------------------- | -------------------------------------------------------- |
| `list.append(x)`    | Adds item `x` to the end of the list.                    |
| `list.insert(i, x)` | Inserts item `x` at position `i`.                        |
| `list.extend(iter)` | Extends list by appending elements from the iterable.    |
| `list.remove(x)`    | Removes the first occurrence of item `x`.                |
| `list.pop([i])`     | Removes and returns item at index `i` (default is last). |
| `list.clear()`      | Removes all items from the list.                         |
| `list.index(x)`     | Returns the index of first occurrence of item `x`.       |
| `list.count(x)`     | Returns the number of times `x` appears in the list.     |
| `list.sort()`       | Sorts the list in ascending order.                       |
| `list.reverse()`    | Reverses the list in place.                              |
| `list.copy()`       | Returns a shallow copy of the list.                      |

Tuple Methods
| **Method**       | **Description**                                       |
| ---------------- | ----------------------------------------------------- |
| `tuple.count(x)` | Returns the number of times `x` appears in the tuple. |
| `tuple.index(x)` | Returns the index of the first occurrence of `x`.     |
 
 Set Methods
| **Method**                       | **Description**                                    |
| -------------------------------- | -------------------------------------------------- |
| `set.add(x)`                     | Adds element `x` to the set.                       |
| `set.update(iter)`               | Updates set with elements from the iterable.       |
| `set.remove(x)`                  | Removes `x` from set; raises error if not present. |
| `set.discard(x)`                 | Removes `x` if present; no error if not.           |
| `set.pop()`                      | Removes and returns an arbitrary element.          |
| `set.clear()`                    | Removes all elements from the set.                 |
| `set.union(set2)`                | Returns a union of two sets.                       |
| `set.intersection(set2)`         | Returns common elements of both sets.              |
| `set.difference(set2)`           | Returns elements in set1 but not in set2.          |
| `set.symmetric_difference(set2)` | Returns elements in either set, but not both.      |
| `set.issubset(set2)`             | Checks if the set is a subset of set2.             |
| `set.issuperset(set2)`           | Checks if the set is a superset of set2.           |

Dictionary Methods
| **Method**               | **Description**                                                             |
| ------------------------ | --------------------------------------------------------------------------- |
| `dict.get(key, default)` | Returns the value for `key` if it exists, else `default`.                   |
| `dict.keys()`            | Returns a view of dictionary keys.                                          |
| `dict.values()`          | Returns a view of dictionary values.                                        |
| `dict.items()`           | Returns a view of key-value pairs.                                          |
| `dict.update(other)`     | Updates dictionary with key-value pairs from `other`.                       |
| `dict.pop(key)`          | Removes specified key and returns the value.                                |
| `dict.popitem()`         | Removes and returns the last key-value pair.                                |
| `dict.setdefault(k, d)`  | Returns the value of key `k`. If not present, inserts `k` with default `d`. |
| `dict.clear()`           | Removes all items from the dictionary.                                      |
| `dict.copy()`            | Returns a shallow copy of the dictionary.                                   |

