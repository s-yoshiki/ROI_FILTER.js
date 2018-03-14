
<h1> ROI_FILTER.js</h1>

複雑な形状のROI(関心領域)に対してフィルタをかけることができる,画像処理ライブラリ.

<div align="center">
	<img src="https://github.com/s-yoshiki/ROI_FILTER.js/blob/master/picture/sample.png" width="256" height="256">
</div>

<div>
	<a href="http://jsrun.it/s.yoshiki1123/0EQI">DEMO</a>
</div>
<div>
	--サポートブラウザ--
	<ul>
		<li>Chrome</li>
		<li>Firefox</li>
		<li>Safari</li>
		<li>Opera</li>
	</ul>
	(2015/11/22 現在の最新版)
</div>

## 基本
### インスタンス生成

```js
var roi = new ROI_FILTER("canvas_id");
```

## メソッド
### 画像書き込み
```js
var image = new Image();
image.src = "./picture/lena.png";
roi.setImage(image, 512, 512);
```

### debuger
```js
roi.sandstorm();
```

### グレースケール変換
```js
roi.grayscale();
```

### スカラ
```js
roi.scalar(r,g,b);
//exsample
roi.scalar(1.0 ,1.3 ,0.8);
```

### バイナリ化
```js
var THRESHOLD = 50;
roi.threshold(THRESHOLD);
```

### canny edge 
```js
roi.canny(THRESHOLD);
```

### ラプラシアン (3x3)
```js
roi.laplacian();
```

### ビット反転
```js
roi.reverse();
```

### 画像配列 R,G,Bに対してr,g,bで塗りつぶす(R=r,G=g,B=b).
反映されるのは0以上の時
```js
roi.fill(r,g,b);
//exsample
roi.fill(20,50,100);
roi.fill(20,50,-1);//Bは反映されない
```

### 3x3 gaussian フィルタ
```js
roi.gaussian();
```

### チャンネル置換
```js
roi.change("r","g","b");
//exsample
roi.change("g","b","r");
roi.change("r","r","b");
roi.change("g","g","g");
```

###  平滑化
```js
roi.average();
```

## イレギュラーな処理

### 矩形
```js
roi.rect.sandstorm(x,y,w,h);
```

### 三角形
```js
roi.triangle.sandstorm(x1,y1,x2,y2,x3,y3);
```

### 円
```js
roi.circle.sandstorm(x,y,w,h);
```

### 多角形・ポリゴン 
```js
roi.polygon.sandstorm([x1,x2,x3...xn],[y1,y2,y3...yn]);
```


Copyright © 2015 Yoshiki Shinagawa Licensed under the MIT License
