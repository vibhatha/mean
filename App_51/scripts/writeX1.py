
def write(text):
    fo = open("X.txt", "a")
    #fo.write(bytes(text, 'UTF-8'))
    #fo.write(bytes('\n', 'UTF-8'))
    fo.write(text)
    fo.write('\n')
    # Close opend file
    fo.close()