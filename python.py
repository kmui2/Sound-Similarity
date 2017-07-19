# python_launched_from_nodejs.py
import sys

data = "this began life in python"
print(data)

f= open("null/guru99.txt","w+")
for i in range(10):
     f.write("This is line %d\r\n" % (i+1))
f.close() 

sys.stdout.flush()

