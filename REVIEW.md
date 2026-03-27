1. userDashboardService
    - line 4:12
        1. guaranty users data type is array, even response having unexpected result.
        2. handle http request failed and trace the error message
    - line 19:26
        1. handle no id.
        2. as the method name: getUser, this suppose is try to fine single user. So, use find method to output object instead of array.
        3. user not found handle
    - line 29:38
        1. handle no id or no changes
        2. try to catch update error and return back the original users set.
        3. use the map method to replace the updated user instead of http get users data one more time
    - line 41:49
        1. handle no query, if all empty, return back the original users data
        2. use the filter method to try to return matched users. which is more readable and clean