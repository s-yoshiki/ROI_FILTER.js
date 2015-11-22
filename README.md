
<h1> ROI_FILTER.js</h1>

複雑な形状のROI(関心領域)に対してフィルタをかけることができる,画像処理ライブラリ.
<div align="center">
	--サポートブラウザ--
	<ul>
		<li>Chrome</li>
		<li>Firefox</li>
		<li>Safari</li>
		<li>Opera</li>
	</ul>
	(2015/11/22 現在の最新版)
</div>

<div id="main">
	<div id="">
		<h3>まずはじめに</h3>
		
		<pre><!--
		var roi = new ROI_FILTER("canvas_id");

		--></pre>
	</div>

	<div id="">
		<h3>画像を書き込む</h3>
		
		<pre><!--
		var image = new Image();
		image.src = "./picture/lena.png";
		roi.setImage(image, 512, 512);
		--></pre>
	</div>

	<div>
		<h3>画像全体にフィルタをかける</h3>
	</div>
</div>


<div id="footer">
	The MIT License (MIT)  Copyright (c) 2015 Yoshiki Shinagawa
</div>

<style>
	pre{
		background: #FFEEFD;
	}
</style>