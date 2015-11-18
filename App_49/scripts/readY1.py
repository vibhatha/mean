import numpy as np
#definding numpy X array

def read():
    Y =[]
    fobj = open("y.txt")
    for line in fobj:
        y=[]
        arr=line.rstrip()
        values=str.split(arr, ",")
        #print(len(values))
       
        if(len(values)==2):
            values=values[0]
            value=int(values)
            Y.append(value)
        
    		
    fobj.close()
    #np.asarray(X)
    return Y


def getY():
    arrayY = read()
    print(arrayY)
     
    
getY()
  
    
