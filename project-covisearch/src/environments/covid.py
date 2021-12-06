import cv2
import numpy as np
img = cv2.imread('/Users/hipswan/Desktop/information retrieval/project4/ub-ir-final-project/project-covisearch/src/environments/corona.jpg')
cv2.imwrite('/Users/hipswan/Desktop/information retrieval/project4/ub-ir-final-project/project-covisearch/src/environments/corona_gray.jpg',cv2.cvtColor(img,cv2.COLOR_BGR2GRAY))