# 日记

## 我给我的华为MateBook E平板安装了Linux系统，这是注意事项哦

昨天是4月17日，我考完了中考的英语听说模拟考，不是很难，当然这个不是重点。

**重点是**，我给**吃灰了很久的华为平板安装了Linux**，它可以**正常运行**，没有**别的显示错误**。

按照**一般情况来看是会出现驱动错误**的，屏幕会**出现各种莫名其妙的情况**。

缺点是**有点卡**，不过**本来的原系统Windows11就很卡**来着。

你**需要准备**一个[Endeavour OS](https://endeavouros.com/)的**系统安装盘**，当然原版Arch或者**别的什么系统也可以**，只需要**保证内核是LTS**就可以了（只能用这个，**其它的实测无法启动**）。

 因为**驱动问题**，**安装盘可能进不去**。但是没关系，我们只需要**选择带nomodeset的那个**；如果你**没有对应选项**，你需要**在启动项页面（无论是systemd-boot还是grub）按下e键**，在启动项**linux那一行的最末尾添加nomodset**就可以了，记得前面要空格隔开，不然无法启动；如果你的安装盘是systemd的，只需**在最末尾添加即可**，不需要找到到哪行，因为**这个就只有一行**。

进入系统之后就是很普通的安装流程，注意，**一定要安装LTS内核**，如果你的系统Debian、Ubuntu那些**自带长期支持内核的就不需要管那么多**。

最重点的来了，安装好系统后，你需要**编辑启动项**。

### grub

一般来说，文件是/etc/default/grub，使用你的编辑器，打开这个文件，在GRUB_CMDLINE_LINUX_DEFAULT这个变量后面，按照下面那么写（三个点代表前面的，不要改前面已经有的参数）

```
GRUB_CMDLINE_LINUX_DEFAULT="... i915.enable_psr=0 i915.enable_dc=0 i915.enable_guc=2 snd_hda_intel.dmic_detect=0 snd_intel_dspcfg.dsp_driver=1 acpi_enforce_resources=lax i801_smbus.force=1"
```

保存好文件后，在命令行输入

```bash
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

生成好文件后就可以重启了，重启之后问题就解决差不多了。

### systemd-boot

这个很难讲一般情况，因为**没有统一的存放位置**（其实grub也没有，但是各大发行版好像约好一样放在一个位置），所以就拿我使用的Endeavour OS来举例子吧！可能不适合你的系统，但是大差不差。

在/efi/loader/entries/这个地方，有我们需要编辑的配置文件。

你找找**哪个是LTS的，一般有两个，一个是普通的，一个是FALLBACK的**。

普通的就是普通的，FALLBACK那个是平时系统打不开的时候会进去的。

如果你想保险一点，那就两个一起写吧！其实只要写一个就可以了，写普通的那个。

编辑文件，在options那行，像下面这样写（三个点代表的是前面的参数，不要删除或者更改）

```
options ... i915.enable_psr=0 i915.enable_dc=0 i915.enable_guc=2 snd_hda_intel.dmic_detect=0 snd_intel_dspcfg.dsp_driver=1 acpi_enforce_resources=lax i801_smbus.force=1
```

保存好后输入

```bash
sudo bootctl update
```

重启就可以解决问题了。

当然，我可不满足于默认的界面。

我折腾了一会，弄成了下面的样子

![](imgs/IMG_20250418_181719.jpg)

怎么样，还是很好看的吧！！！

这是[end-4](https://end-4.github.io/dots-hyprland-wiki/zh-cn/)大佬的hyprland美化脚本，壁纸是我自己的，喜欢的可以去看看哦。