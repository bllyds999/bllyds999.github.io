---
title: Markdown 常用语法
date: 2026-04-04 23:11:39
categories: Hexo 教程
cover: /assets/images/cover/hexo.webp
tags:
  - Hexo 教程
  - Hexo
  - Markdown 语法
  - Markdown 教程
  - 常用语法
---

Markdown 其实可以算是 HTML 的简化版，写起来要比 HTML 方便很多。

## 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
```

等价 HTML 标签：

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
```

一级标题是用的最少的，写文档时一般用二级标题。

## 链接

```markdown
[文本](链接)
```

等价 HTML 标签：

```html
<a href="链接">文本</a>
```

## 图片

```markdown
![文本](图片链接)
```

等价 HTML 标签：

```html
<img src="图片链接" alt="文本">
```

## 表格

```markdown
| 表格标题 1 | 表格标题 2 | 表格标题 3 |
| :--: | :--: | :--: |
| 表格内容 1 | 表格内容 2 | 表格内容 3 |
```

等价 HTML 标签：

```html
<table>
  <tr>
    <th>表格标题 1</th>
    <th>表格标题 2</th>
    <th>表格标题 3</th>
  </tr>
  <tr>
    <td>表格内容 1</td>
    <td>表格内容 2</td>
    <td>表格内容 3</td>
  </tr>
</table>
```

## 序列

### 有序序列

```markdown
1. 有序序列 1
2. 有序序列 2
3. 有序序列 3
```

等价 HTML 标签：

```html
<ol>
  <li>有序序列 1</li>
  <li>有序序列 2</li>
  <li>有序序列 3</li>
</ol>
```

### 无序序列

```markdown
- 无序序列 1
- 无序序列 2
- 无序序列 3
```

等价 HTML 标签：

```html
<ul>
  <li>无序序列 1</li>
  <li>无序序列 2</li>
  <li>无序序列 3</li>
</ul>
```

## 删除

```markdown
~~删除线~~
```

等价 HTML 标签：

```html
<s>删除线</s>
```

## 斜体

```markdown
*斜体*
```

等价 HTML 标签：

```html
<i>斜体</i>
```

## 标粗

```markdown
**标粗**
```

等价 HTML 标签：

```html
<b>标粗</b>
```

## 引用

```markdown
> 引用内容
```

等价 HTML 标签：

```html
<blockquote>
  引用内容
</blockquote>
```

## 分割

```markdown
---
```

等价 HTML 标签：

```html
<hr>
```

## 代码

### 行内代码

```markdown
`print("hello world")`
```

等价 HTML 标签：

```html
<code>("hello world")</code>
```

### 代码块

````markdown
```python
print("hello world")
```
````

等价 HTML 标签：

```html
<pre>
  <code>print("hello world")</code>
</pre>
```

## 任务

### 待办

```markdown
- [ ] 待办事项 1
- [ ] 待办事项 2
- [ ] 待办事项 3
```

等价 HTML 标签：

```html
<ul>
  <li><input type="checkbox" value=""> 待办事项 1</li>
  <li><input type="checkbox" value=""> 待办事项 2</li>
  <li><input type="checkbox" value=""> 待办事项 3</li>
</ul>
```

### 已办

```markdown
- [x] 已办事项 1
- [x] 已办事项 2
- [x] 已办事项 3
```

等价 HTML 标签：

```html
<ul>
  <li><input type="checkbox" value="x" checked> 已办事项 1</li>
  <li><input type="checkbox" value="x" checked> 已办事项 2</li>
  <li><input type="checkbox" value="x" checked> 已办事项 3</li>
</ul>
```