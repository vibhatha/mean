import time
import readX1
import readY1
import writeX1
import writeY1
import numpy as np
import matplotlib.pyplot as plt

from sklearn.cluster import MiniBatchKMeans, KMeans
from sklearn.metrics.pairwise import pairwise_distances_argmin
from sklearn.datasets.samples_generator import make_blobs

##############################################################################
# Generate sample data
np.random.seed(0)

batch_size = 100
centers = [[1, 1], [-1, -1], [1, -1],[-1,1],[2,2],[-2,-2],[2,-2],[-2,2],[3,3],[3,-3],[-3,3]]
n_clusters = len(centers)
#X, labels_true = make_blobs(n_samples=3000, centers=centers, cluster_std=0.7)

color_library=['#f44336','#e91e63','#9c27b0','#ff1744','#f50057','#d500f9','#2196f3','#b388ff','#8c9eff','#448aff','#03a9f4','#009688','#0091ea',
'#00b8d4','#00bfa5','#cddc39','#00e676','#76ff03','#c6ff00','#ffeb3b','#ff5722','#795548','#9e9e9e','#607d8b']



X = readX1.read()
X = np.asarray(X)
#print("X1 : ",X)


y = readY1.read()
y = np.asarray(y)


np_of_centers = np.unique(y)
unique=np_of_centers.shape[0]
print("No of centers :",np_of_centers.shape[0])
centers = [[1, 1], [-1, -1], [1, -1],[-1,1]]
n_clusters = (unique)

#print("X : ",X)
#print("labels :",labels_true)

##############################################################################
# Compute clustering with Means

k_means = KMeans(init='k-means++', n_clusters=unique, n_init=10)
t0 = time.time()
k_means.fit(X)
t_batch = time.time() - t0
k_means_labels = k_means.labels_
k_means_cluster_centers = k_means.cluster_centers_
#calculate number of unique labels of devices in the target array
k_means_labels_unique = np.unique(k_means_labels)

print("unique labels : ",k_means_labels_unique)
print("cluster centers : ", k_means_cluster_centers.shape)

print("new data set prediction")
print("==============================")

X_test=[[567.34,568.89,233.32,0.89,0.97],[1567.34,1568.89,233.32,0.89,0.97],[11567.34,11568.89,233.32,0.89,0.97],
       [221.68, 228.36, 229.59, 0.99, 0.97],[220.68, 227.36, 229.59, 0.98, 0.97],[114.47, 119.28, 228.93, 0.52, 0.96],
        [172.35, 178.07, 230.46, 0.77, 0.97],[59.13, 63.00, 232.60, 0.27, 0.94],[58.13, 62.00, 232.60, 0.27, 0.94],[1220.68, 1227.36, 229.59, 0.98, 0.97],[11220.68, 11227.36, 229.59, 0.98, 0.97],[111220.68, 111227.36, 229.59, 0.98, 0.97]]

print("X test length",len(X_test))
itr=0;
for x in X_test:
    
    pred=k_means.predict([x])
    score=k_means.score([x])
    score=int(score)
    score = abs(score)
    print(itr," pre-score : ",score)
    if((score<=10 & score>=0) ):                
        print(x)
        print("prediction : ",pred)
        print("score : ",score)
        itr=itr+1 
    elif(score>10):
        print(x)
        X = readX1.read()
        X = np.asarray(X)
        y = readY1.read()
        y = np.asarray(y)
        str1 = ','.join(str(e) for e in x)
        #print(str1)
        writeX1.write(str1)
        device_Id= np.amax(y)
        str2 = str(device_Id+1)
        writeY1.write(str2)
        print('new device id: ',device_Id)
        print('new device')
        itr=itr+1 
      
    

##############################################################################
# Plot result

fig = plt.figure(figsize=(16,8))
fig.subplots_adjust(left=0.02, right=0.98, bottom=0.05, top=0.9)
colors = ['#4EACC5', '#FF9C34', '#4E9A06','#4E9A06',"#81d4fa",'#80cbc4','#43a047','#607d8b']
colors= color_library

# We want to have the same colors for the same cluster from the
# MiniBatchKMeans and the KMeans algorithm. Let's pair the cluster centers per
# closest one.

print("n_clusters :",n_clusters)

# KMeans
ax = fig.add_subplot(1, 1, 1)
for k, col in zip(range(n_clusters), colors):
    my_members = k_means_labels == k
    cluster_center = k_means_cluster_centers[k]
    ax.plot(X[my_members, 0], X[my_members, 1], 'w',
            markerfacecolor=col, marker='.')
    ax.plot(cluster_center[0], cluster_center[1], 'o', markerfacecolor=col,
            markeredgecolor='k', markersize=6)
ax.set_title('KMeans')
ax.set_xticks(())
ax.set_yticks(())
plt.text(0.0, 1.8,  'train time: %.2fs\ninertia: %f' % (
    t_batch, k_means.inertia_))

plt.show()

