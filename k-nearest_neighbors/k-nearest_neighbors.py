import numpy as np
from sklearn.model_selection import cross_val_score
from sklearn import preprocessing, neighbors
#from sklearn.neighbors import NearestNeighbors
from sklearn.model_selection import train_test_split
import pandas as pd
import pickle

df = pd.read_csv('breast-cancer-wisconsin.data.txt')
df.replace('?', -99999, inplace=True)
df.drop(['id'], 1, inplace=True)

X = np.array(df.drop(['class'], 1))
y = np.array(df['class'])

X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2)

#--------Run to train----------#
clf = neighbors.KNeighborsClassifier()
clf.fit(X_train, y_train)

with open('KNeighbor.pickle', 'wb') as f:
    pickle.dump(clf, f)

pickle_in = open('KNeighbor.pickle', 'rb')
clf = pickle.load(pickle_in)
#------------------------------#
accuracy = clf.score(X_test, y_test)
print(accuracy)

example_measures = np.array([[4,2,1,1,1,2,3,2,1],[10,2,4,6,4,5,3,2,1]])

prediction = clf.predict(example_measures)

print(prediction)