
def write(text):
    fo = open("y.txt", "a")
    #fo.write(bytes(text, 'UTF-8'))
    #fo.write(bytes('\n', 'UTF-8'))
    text+=','
    fo.write(text)
    fo.write('\n')
    
    
    # Close opend file
    fo.close()