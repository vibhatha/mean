import numpy as np
#definding numpy X array

def read():
    X =[]
    fobj = open("X.txt")
    for line in fobj:
        x=[]
        arr=line.rstrip()
        values=str.split(arr, ",")
        #print(len(values))
        if(len(values)==5):
            array=list(map(float, values))
            #print(array)
            X.append(array)
        
    		
    fobj.close()
    #np.asarray(X)
    return X


def getX():
    arrayX = read()
    #print(arrayX)
     
    
getX()
  
    
