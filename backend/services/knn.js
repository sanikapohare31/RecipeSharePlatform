import mongoose from "mongoose";
export function euclideanDistance(vec1, vec2) {
    // Ensure both vectors are of the same length
    if (vec1.length !== vec2.length) {
        throw new Error('Input vectors must be of the same length');
    }
    return Math.sqrt(vec1.reduce((sum, value, index) => sum + Math.pow(value - vec2[index], 2), 0));
}

// export function knn(trainingData, newData, k) {
//     console.log('Training Data:', trainingData);
//     console.log('New Data:', newData);
//     if (k <= 0) {
//         throw new Error('k must be a positive integer');
//     }
//     if (trainingData.length === 0) {
//         throw new Error('Training data must not be empty');
//     }

//     // Ensure k does not exceed training data length
//     k = Math.min(k, trainingData.length);

//     const distances = trainingData.map(dataPoint => {
//         return {
//             distance: euclideanDistance(dataPoint.features, newData.features),
//             label: dataPoint.label
//         };
//     });
   
//     // Sort distances in ascending order
//     distances.sort((a, b) => a.distance - b.distance);

//     // Get the top k closest neighbors
//     const neighbors = distances.slice(0, k);

//     // Count the occurrences of each label
//     const labelCount = {};
//     neighbors.forEach(neighbor => {
//         labelCount[neighbor.label] = (labelCount[neighbor.label] || 0) + 1;
//     });
    
//     console.log('Top K Neighbors:', neighbors);
//     console.log('Label Count:', labelCount);

//     // Find the label with the highest count
//     return Object.keys(labelCount).reduce((a, b) => (labelCount[a] > labelCount[b] ? a : b), null);
// }
export function knn(trainingData, newData, k) {
    console.log('Training Data:', trainingData);
    console.log('New Data:', newData);
    
    if (k <= 0) {
        throw new Error('k must be a positive integer');
    }
    if (trainingData.length === 0) {
        throw new Error('Training data must not be empty');
    }

    // Ensure k does not exceed training data length
    k = Math.min(k, trainingData.length);

    const distances = trainingData.map(dataPoint => {
        return {
            distance: euclideanDistance(dataPoint.features, newData.features),
            label: dataPoint.label
        };
    });

    // Sort distances in ascending order
    distances.sort((a, b) => a.distance - b.distance);

    // Get the top k closest neighbors
    const neighbors = distances.slice(0, k);

    // Check if neighbors have valid labels
    neighbors.forEach((neighbor, index) => {
        if (!neighbor.label || !mongoose.Types.ObjectId.isValid(neighbor.label)) {
            console.error(`Neighbor at index ${index} has an invalid label:`, neighbor);
        }
    });

    // Optionally log neighbors for debugging
    console.log('Top K Neighbors:', neighbors);

    // Return an array of labels of the top k neighbors
    return neighbors.map(neighbor => neighbor.label);
}
