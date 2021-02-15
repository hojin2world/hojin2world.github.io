# clone()

배열의 복사와 관련해서는 얕은 복사와 깊은 복사의 차이점을 알아야 한다.



### 얕은 복사(shallow copy)

* 한 쪽에서 수정이 발생되면 다른쪽에도 영향을 끼쳐 같아지게 된다.

* 가능한 이유는 얕은 복사가 주소값을 복사하기 때문에 주소로 값을 참조하여 값이 변경되면 해당 값을 참조하고 있는 배열들의 값이 변경된다.
* 즉, 복사된 배열이나 원본 배열이 변경될 때, 함께 변경된다. = 연산자는 얕은 복사를 수행한다.

````+Java
int[] a = new int[2];
a[0] = 2;
a[1] = 4;
int[] b = a;
b[0] = 6;
b[1] = 8;

System.out.println(a[0]+", "+a[1]);
System.out.println(b[0]+", "+b[1]);

// 결과
6, 8
6, 8
````

* 위의 코드처럼 1차원 배열을 = 연산자를 사용해 얕은 복사를 진행하게 되면 복사된 배열의 값이 변경될 때, 원본 배열의 값도 변경된다.
* 2차원 배열도 마찬가지이다. 다음 코드를 보자.

````+Java
int[][] a = new int[2][2];
int[][] copy = a;

copy[0][0] = 1;

for (int[] aa : a) {
    for (int v : aa) System.out.print(v + " ");
    System.out.println();
}
System.out.println();
for (int[] aa : copy) {
    for (int v : aa) System.out.print(v + " ");
    System.out.println();
}

// 결과
1 0
0 0

1 0
0 0
````

* = 연산자를 이용해 2차원 배열에서 얕은 복사가 이뤄졌다. 그렇다면 이러한 문제를 어떻게 해결할 수 있을까? 깊은 복사를 사용하자!



### 깊은 복사(Deep copy)

----------------

* 깊은 복사는 주소값을 참조하는 것이 아닌, 새로운 메모리 공간에 값을 복사하는 것이기 때문에 원본 배열이 변경되어도 복사된 배열에 전혀 상관이 없다.
* 따라서 **배열을 복사한 후에 한쪽 값을 수정해도 다른 배열에 영향을 끼치지 않는다.**



```
1) 1차원 배열의 깊은 복사
```

 

- 1차원 배열의 깊은 복사는 배열.clone() 함수를 이용하면 간단하게 할 수 있다.(일반 자료형의 경우)
- 혹은 간단하게 for문을 돌며 넣어줘도 된다.

````+Java
public static void main(String[] args) {
    int[] arr = new int[10];
    int[] copy = deepCopyWithClone(arr);
    
    for (int i = 0; i < arr.length; i++) arr[i] = i;
    for (int a : arr) System.out.print(a + " ");

    System.out.println();
    copy[0] = 100;
    for (int a : copy) System.out.print(a + " ");
}

private static int[] deepCopyWithClone(int[] original) {
    if (original == null) return null;
    int[] result = new int[original.length];

    result = original.clone();
    return result;
}

// 결과
0 1 2 3 4 5 6 7 8 9 -> arr
100 0 0 0 0 0 0 0 0 0 -> copy
````

- 객체 배열의 경우, `.clone()`을 사용하면 깊은 복사가 안된다. 이유는 객체는 주소값을 가지고 있기 때문이다. 마찬가지로 2차원 배열의 경우도 각각 row에 대한 주소값을 가지고 있기 때문에 deepCopy가 안된다.



2) 1차원 객체 배열의 경우, 깊은 복사

````+Java
private static void ObjectArray() {
    Position[] pos = new Position[10];
    for (int i = 0; i < pos.length; i++) pos[i] = new Position(i, i);

    Position[] copy = deepCopy(pos);
    copy[0].a = 100;
    copy[0].b = 200;

    for (int i = 0; i < pos.length; i++) {
        System.out.print("(" + pos[i].a + ", " + pos[i].b + ")");
    }
    System.out.println();

    for (int i = 0; i < copy.length; i++) {
        System.out.print("(" + copy[i].a + ", " + copy[i].b + ")");
    }
}

private static Position[] deepCopy(Position[] original) {
    if (original == null) return null;
    Position[] result = new Position[original.length];
    for (int i = 0; i < result.length; i++) result[i] = new Position(original[i].a, original[i].b);

    return result;
}

// 결과
(0, 0)(1, 1)(2, 2)(3, 3)(4, 4)(5, 5)(6, 6)(7, 7)(8, 8)(9, 9)
(100, 200)(1, 1)(2, 2)(3, 3)(4, 4)(5, 5)(6, 6)(7, 7)(8, 8)(9, 9)
````

- 이처럼 1차원 객체 배열을 복사하기 위해서는 for문을 돌며 넣어주는데 이때마다 새로운 객체를 new로 생성하며 직접 값을 넣어주어야 한다. 그래야 다른 새로운 객체를 담은 배열로 복사된 배열을 가질 수 있다.



```
3) 2차원 배열의 깊은 복사
```

1. **이중 for문을 순회하는 방법**

- 기본 자료형인 경우, 간단하게 사용할 수 있다.

````+Java
private static void TwoArrayDeepCopy() {
    int[][] arr = new int[5][5];
    int[][] copy = deepCopyTwoArray(arr);

    arr[0][0] = 1;
    copy[0][1] = 2;

    for (int i = 0; i < arr.length; i++) {
        for (int j = 0; j < arr.length; j++) {
            System.out.print(arr[i][j] + " ");
        }
        System.out.println();
    }

    System.out.println();

    for (int i = 0; i < copy.length; i++) {
        for (int j = 0; j < copy.length; j++) {
            System.out.print(copy[i][j] + " ");
        }
        System.out.println();
    }

    System.out.println();
}

private static int[][] deepCopyTwoArray(int[][] original) {
    if (original == null) return null;
    int[][] result = new int[original.length][original.length];
    for (int i = 0; i < result.length; i++) {
        for (int j = 0; j < result.length; j++) {
            result[i][j] = original[i][j];
        }
    }
    return result;
}

// 결과
// arr
1 0 0 0 0 
0 0 0 0 0 
0 0 0 0 0 
0 0 0 0 0 
0 0 0 0 0 

// copy
0 2 0 0 0 
0 0 0 0 0 
0 0 0 0 0 
0 0 0 0 0 
0 0 0 0 0
````

- 이처럼 값을 직접 넣어줘도 deepCopy가 잘된다. 배열을 복사한 이후, 복사한 배열의 값을 변경해도 원래 배열에 영향을 끼치지 않는 깊은 복사가 잘 이루어졌다.

   

2.System.arraycopy를 이용하는 방법

- 기본 자료형인 경우, 아래 코드처럼 System.arraycopy 메소드를 이용해 2차원 배열을 복사할 수 있다.
- 1차원 배열을 2차원 배열의 row 길이만큼 복사한다고 생각하면 된다.
- 1번에서 사용한 배열과 같은 배열을 사용했다.

````+Java
private static int[][] deepCopyUseSystemArrayCopy(int[][] original) {
    if (original == null) return null;
    int[][] result = new int[original.length][original.length];
    for (int i = 0; i < result.length; i++) {
        System.arraycopy(original[i], 0, result[i], 0, original[i].length);
    }
    return result;
}
// 결과
1 0 0 0 0 
0 0 0 0 0 
0 0 0 0 0 
0 0 0 0 0 
0 0 0 0 0 

0 2 0 0 0 
0 0 0 0 0 
0 0 0 0 0 
0 0 0 0 0 
0 0 0 0 0
````

- 1번과 동일한 결과를 보이며, deepCopy가 이루어졌음을 확인할 수 있다.

  

```
4) 2차원 객체 배열의 복사
```

- 2차원 객체 배열의 복사를 할 경우, arraycopy나 clone을 이용해서 복사할 수 없다.
- 그래서 for문을 돌면서 값을 직접 복사하며, 객체를 새로 생성해야 한다.

````+Java
 public static void main(String[] args) {
    Position[][] positions = new Position[3][3];
    for (int i = 0; i < positions.length; i++) {
        for (int j = 0; j < positions[i].length; j++) {
            positions[i][j] = new Position(i, j);
        }
    }
    Position[][] copy = deepCopy(positions);
    copy[0][0].a = 100;
    copy[0][1].b = 200;
    positions[0][0].a = 2;
    positions[0][0].b = 2;

    print(positions);
    print(copy);
}

public static void print(Position[][] arr) {
    for (int i = 0; i < arr.length; i++) {
        for (int j = 0; j < arr[0].length; j++) {
            Position pos = arr[i][j];
            System.out.print("(" + pos.a + ", " + pos.b + ") ");
        }
        System.out.println();
    }
    System.out.println();
}

// for문을 돌면서 값을 직접 복사하며 객체를 새로 생성한다.
private static Position[][] deepCopy(Position[][] original) {
    if (original == null) return null;
    Position[][] result = new Position[original.length][original.length];

    for (int i = 0; i < result.length; i++) {
        for (int j = 0; j < result[i].length; j++) {
            result[i][j] = new Position(original[i][j]);
        }
    }
    return result;
}

static class Position {
    int a;
    int b;

    Position(int a, int b) {
        this.a = a;
        this.b = b;
    }

    // 복사를 위한 생성자.
    Position(Position position) {
        this.a = position.a;
        this.b = position.b;
    }
}
````

