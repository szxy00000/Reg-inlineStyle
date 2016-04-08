替换文件中的行内样式，`<style>`标签，生成less文件
```
gulp.task('style', [], function () {
    return gulp.src('./src/tags/setting/*.tag')
    .pipe(nemoReg(__dirname + '/src/css/param'))   // 生成的less文件路径
    .pipe(gulp.dest('./src/tags/param'));		   // 替换后的文件路径。可覆盖原路径
})
```