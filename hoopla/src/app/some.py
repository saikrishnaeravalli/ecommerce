def count_analogous_arrays(consecutive_differences, lowerBound, upperBound):
    maxdiff = float('-inf')
    mindiff = float('inf')
    runningsum = 0

    if len(consecutive_differences) == 0:
        return 0
    if upperBound < lowerBound:
        return 0
    for diff in consecutive_differences:
        runningsum += diff
        if runningsum > maxdiff:
            maxdiff = runningsum
        if runningsum < mindiff:
            mindiff = runningsum
    maxvalidupperbound = upperBound + mindiff if upperBound+mindiff < upperBound else upperBound
    minvalidlowerbound = upperBound + mindiff if upperBound+mindiff < upperBound else upperBound

    if maxvalidupperbound >= minvalidlowerbound:
        return maxvalidupperbound-minvalidlowerbound + 1
    else:
        return 0



# Sample input
consecutiveDifference = [1,2]
lowerBound = 3
upperBound = 4

# Call the function and print the result
result = count_analogous_arrays(consecutiveDifference, lowerBound, upperBound)
print(result)
